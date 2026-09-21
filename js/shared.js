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

/* ---------------- Métricas de bioimpedância ---------------- */

const METRICAS_BIO = [
  { chave: "Peso", label: "Peso", unidade: " kg", casas: 1 },
  { chave: "IMC", label: "IMC", unidade: "", casas: 1, classifChave: "Classificação IMC", classifMapa: "imc" },
  { chave: "% Gordura", label: "% Gordura Corporal", unidade: "%", casas: 1, fracao: true },
  { chave: "% Massa Magra", label: "% Massa Magra", unidade: "%", casas: 1, fracao: true },
  { chave: "Gordura Visceral", label: "Gordura Visceral", unidade: "", casas: 0, classifChave: "Classificação Visceral", classifMapa: "visceral" },
  { chave: "Idade Metabólica", label: "Idade Metabólica", unidade: " anos", casas: 0 },
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
