/* =========================================================
   shared.js — funções usadas tanto pela Área do Aluno quanto
   pela Área do Professor: carregamento de dados, cálculo de
   frequência/bioimpedância e formatação. Mantém as duas
   páginas calculando tudo do mesmo jeito.
   ========================================================= */

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function ordemMes(mesStr) {
  const m = String(mesStr || "").match(/(\d{1,2})\/(\d{2,4})/);
  if (!m) return 0;
  let mes = parseInt(m[1], 10);
  let ano = parseInt(m[2], 10);
  if (ano < 100) ano += 2000;
  return ano * 12 + mes;
}

const NOMES_MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

/** Lê uma cor definida em variável CSS (:root), com um valor de reserva. */
function corCss(nomeVar, reserva) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(nomeVar).trim();
  return v || reserva;
}

/** Só os alunos marcados como ativos (ou sem a coluna Ativo preenchida) e com nome. */
function alunosAtivos(alunos) {
  return alunos
    .filter((a) => String(a["Ativo"] || "Sim").trim().toLowerCase() !== "não")
    .filter((a) => (a["Nome Completo"] || "").trim() !== "");
}

/** Carrega os 3 conjuntos de dados — da planilha publicada, ou de demonstração. */
async function carregarDadosPlanilha() {
  if (typeof estaEmDemonstracao === "function" && estaEmDemonstracao()) {
    return {
      alunos: NOMADES_DEMO.alunos,
      frequencia: NOMADES_DEMO.frequencia,
      bioimpedancia: NOMADES_DEMO.bioimpedancia,
      demo: true,
    };
  }
  const [alunos, frequencia, bioimpedancia] = await Promise.all([
    fetchCSV(NOMADES_CONFIG.csvAlunos),
    fetchCSV(NOMADES_CONFIG.csvFrequencia),
    fetchCSV(NOMADES_CONFIG.csvBioimpedancia),
  ]);
  return { alunos, frequencia, bioimpedancia, demo: false };
}

/** Presenças / faltas / total / % de um aluno, somando todos os meses lançados. */
function resumoFrequenciaAluno(frequencia, nome) {
  const linhas = frequencia
    .filter((f) => (f["Nome Completo"] || "").trim() === nome)
    .sort((a, b) => ordemMes(a["Mês"]) - ordemMes(b["Mês"]));
  const presencas = linhas.reduce((s, l) => s + (paraNumero(l["Presenças"]) || 0), 0);
  const faltas = linhas.reduce((s, l) => s + (paraNumero(l["Faltas"]) || 0), 0);
  const total = presencas + faltas;
  return { presencas, faltas, total, pct: total > 0 ? presencas / total : null, linhas };
}

/** A avaliação de bioimpedância mais recente de cada aluno, indexada pelo nome. */
function ultimaMedicaoPorAluno(bioimpedancia) {
  const porAluno = {};
  bioimpedancia.forEach((b) => {
    const d = parseDataBR(b["Data"]);
    const n = (b["Nome Completo"] || "").trim();
    if (!d || !n) return;
    if (!porAluno[n] || d > porAluno[n]._data) porAluno[n] = Object.assign({}, b, { _data: d });
  });
  return porAluno;
}

/** Quantas avaliações cada aluno já tem registradas. */
function contarMedicoesPorAluno(bioimpedancia) {
  const contagem = {};
  bioimpedancia.forEach((b) => {
    const n = (b["Nome Completo"] || "").trim();
    const d = parseDataBR(b["Data"]);
    if (!n || !d) return;
    contagem[n] = (contagem[n] || 0) + 1;
  });
  return contagem;
}

/** Idade em anos completos de quem nasceu em `nascimento`, na data `referencia`. */
function calcularIdade(nascimento, referencia) {
  if (!nascimento || !referencia) return null;
  let idade = referencia.getFullYear() - nascimento.getFullYear();
  const mesDiff = referencia.getMonth() - nascimento.getMonth();
  if (mesDiff < 0 || (mesDiff === 0 && referencia.getDate() < nascimento.getDate())) idade--;
  return idade;
}

/** Posição de gravidade (0 = melhor) de um texto de classificação, undefined vira null.
 *  Não quebra mesmo se `classificacoesOrdem` ainda não existir no config.js
 *  (ex.: config.js antigo, de antes desta função existir) — só deixa de
 *  colorir a variação por faixa nesse caso. */
function ordemClassificacao(mapa, texto) {
  if (!texto) return null;
  const valor = ((NOMADES_CONFIG.classificacoesOrdem || {})[mapa] || {})[texto];
  return valor === undefined ? null : valor;
}

/* ---------------- Métricas de bioimpedância ---------------- */

/* Cada métrica indica como interpretar sua variação (campo "sentido"):
   - "menorMelhor"   → diminuir é melhora (ex.: % de gordura)
   - "maiorMelhor"   → aumentar é melhora (ex.: % de massa magra)
   - "classificacao" → usa a ordem de gravidade da classificação da própria
                        planilha (campo "ordemChave"/"ordemMapa") — cobre
                        Peso e IMC juntos (o Peso usa a classificação do
                        IMC, já que andam sempre juntos numa mesma altura)
   "corVar" é só a variável CSS usada para desenhar essa métrica no gráfico
   de evolução — não tem relação com bom/ruim. */
const METRICAS_BIO = [
  { chave: "Peso", label: "Peso", unidade: " kg", casas: 1,
    sentido: "classificacao", ordemChave: "Classificação IMC", ordemMapa: "imc", corVar: "--brand-maroon" },
  { chave: "IMC", label: "IMC", unidade: "", casas: 1,
    classifChave: "Classificação IMC", classifMapa: "imc",
    sentido: "classificacao", ordemChave: "Classificação IMC", ordemMapa: "imc", corVar: "--brand-ember" },
  { chave: "% Gordura", label: "% Gordura Corporal", unidade: "%", casas: 1, fracao: true,
    sentido: "menorMelhor", corVar: "--bad" },
  { chave: "% Massa Magra", label: "% Massa Magra", unidade: "%", casas: 1, fracao: true,
    sentido: "maiorMelhor", corVar: "--good" },
  { chave: "Gordura Visceral", label: "Gordura Visceral", unidade: "", casas: 0,
    classifChave: "Classificação Visceral", classifMapa: "visceral",
    sentido: "classificacao", ordemChave: "Classificação Visceral", ordemMapa: "visceral", corVar: "--warn" },
  { chave: "Idade Metabólica", label: "Idade Metabólica", unidade: " anos", casas: 0,
    sentido: "menorMelhor", corVar: "--brand-maroon-deep" },
];

function valorMetrica(m, linha) {
  const raw = linha[m.chave];
  return m.fracao ? paraFracao(raw) : paraNumero(raw);
}

function formatarValor(m, num) {
  if (num === null || num === undefined || isNaN(num)) return "-";
  const n = m.fracao ? num * 100 : num;
  return n.toFixed(m.casas) + m.unidade;
}

function badgeClassificacao(m, linha) {
  if (!m.classifChave) return "";
  const texto = (linha[m.classifChave] || "").trim();
  if (!texto) return "";
  const tom = (NOMADES_CONFIG.classificacoes[m.classifMapa] || {})[texto] || "";
  return ` <span class="badge ${tom}">${escapeHtml(texto)}</span>`;
}

/**
 * Tom da variação entre duas avaliações de uma métrica: "good" (melhorou),
 * "bad" (piorou) ou "flat" (praticamente igual / sem informação suficiente
 * pra julgar). Usado para colorir o chip de variação na tabela do aluno.
 */
function tomVariacao(m, linha1, linha2) {
  if (m.sentido === "classificacao") {
    const texto1 = (linha1[m.ordemChave] || "").trim();
    const texto2 = (linha2[m.ordemChave] || "").trim();
    const o1 = ordemClassificacao(m.ordemMapa, texto1);
    const o2 = ordemClassificacao(m.ordemMapa, texto2);
    if (o1 === null || o2 === null) return "flat";
    if (o2 < o1) return "good";
    if (o2 > o1) return "bad";

    // Ficou na mesma faixa (ex.: "Sobrepeso" nas duas avaliações) — ainda
    // assim, andar na direção da faixa ideal já é uma melhora dentro da
    // própria faixa. Não julga flutuação pra quem já está na faixa ideal
    // (ordem 0), só reforça a direção de quem está fora dela. A única
    // classificação "abaixo" do ideal hoje é "Baixo Peso" (onde aumentar é
    // melhora); qualquer outra faixa fora do ideal é "acima" (diminuir é
    // melhora).
    if (o1 === 0) return "flat";
    const v1 = valorMetrica(m, linha1);
    const v2 = valorMetrica(m, linha2);
    if (v1 === null || v2 === null) return "flat";
    const diff = v2 - v1;
    if (Math.abs(diff) < 0.05) return "flat";
    const aumentarEhMelhora = texto2 === "Baixo Peso";
    if (aumentarEhMelhora) return diff > 0 ? "good" : "bad";
    return diff < 0 ? "good" : "bad";
  }

  const v1 = valorMetrica(m, linha1);
  const v2 = valorMetrica(m, linha2);
  if (v1 === null || v2 === null) return "flat";
  const diffMostrado = m.fracao ? (v2 - v1) * 100 : v2 - v1;
  if (Math.abs(diffMostrado) < 0.05) return "flat";
  if (m.sentido === "menorMelhor") return diffMostrado < 0 ? "good" : "bad";
  if (m.sentido === "maiorMelhor") return diffMostrado > 0 ? "good" : "bad";
  return "flat";
}
