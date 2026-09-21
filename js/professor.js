/* =========================================================
   professor.js — Área do Professor · Nômades Crosstraining
   Visão geral da turma: frequência agregada, ranking de
   presença e panorama de bioimpedância de todos os alunos
   ativos.
   ========================================================= */

(function () {
  "use strict";

  const state = { alunos: [], frequencia: [], bioimpedancia: [], rankingCompleto: [] };
  let chartFreqTurma = null, chartImcDist = null, chartVisceralDist = null, chartEvolucao = null;

  const el = (id) => document.getElementById(id);

  const secoes = {
    carregando: el("secao-carregando"),
    erro: el("secao-erro"),
    login: el("secao-login"),
    dashboard: el("secao-dashboard"),
  };

  function mostrarSecao(nome) {
    Object.entries(secoes).forEach(([chave, elemento]) => {
      if (!elemento) return;
      elemento.style.display = chave === nome ? "" : "none";
    });
    const linkSair = el("link-sair-professor");
    if (linkSair) linkSair.style.display = nome === "dashboard" ? "" : "none";
  }

  function corTom(tom) {
    if (tom === "good") return corCss("--good", "#2f6b46");
    if (tom === "warn") return corCss("--warn", "#93601a");
    if (tom === "bad") return corCss("--bad", "#a53324");
    return corCss("--ink-soft", "#5a4b40");
  }

  /* ---------------- Carregamento de dados ---------------- */

  async function carregarDados() {
    const dados = await carregarDadosPlanilha();
    state.alunos = dados.alunos;
    state.frequencia = dados.frequencia;
    state.bioimpedancia = dados.bioimpedancia;
    if (dados.demo) {
      const aviso = el("aviso-demo");
      if (aviso) aviso.style.display = "block";
    }
  }

  /* ---------------- Login ---------------- */

  function mostrarErroLogin(msg) {
    const box = el("erro-login");
    box.textContent = msg;
    box.classList.add("is-visible");
  }
  function esconderErroLogin() { el("erro-login").classList.remove("is-visible"); }

  function tratarLogin(evento) {
    evento.preventDefault();
    const senha = el("input-senha-professor").value.trim();
    if (!senha) { mostrarErroLogin("Informe a senha."); return; }
    if (senha !== NOMADES_CONFIG.senhaProfessor) {
      mostrarErroLogin("Senha incorreta.");
      return;
    }
    esconderErroLogin();
    renderizarDashboard();
    mostrarSecao("dashboard");
  }

  function sair(evento) {
    evento.preventDefault();
    el("formulario-login-professor").reset();
    esconderErroLogin();
    mostrarSecao("login");
  }

  /* ---------------- KPIs ---------------- */

  function frequenciaGeralTurma(nomesAtivos) {
    const nomesSet = new Set(nomesAtivos);
    let presencas = 0, faltas = 0;
    state.frequencia.forEach((f) => {
      const nome = (f["Nome Completo"] || "").trim();
      if (!nomesSet.has(nome)) return;
      presencas += paraNumero(f["Presenças"]) || 0;
      faltas += paraNumero(f["Faltas"]) || 0;
    });
    const total = presencas + faltas;
    return total > 0 ? presencas / total : null;
  }

  function renderizarKpis(nomesAtivos, ultimaPorAluno, contagemMedicoes) {
    el("kpi-alunos").textContent = nomesAtivos.length;

    const pctTurma = frequenciaGeralTurma(nomesAtivos);
    el("kpi-frequencia").textContent = pctTurma !== null ? Math.round(pctTurma * 100) + "%" : "—";

    const imcs = nomesAtivos
      .map((n) => ultimaPorAluno[n] ? paraNumero(ultimaPorAluno[n]["IMC"]) : null)
      .filter((v) => v !== null && !isNaN(v));
    const imcMedio = imcs.length ? imcs.reduce((a, b) => a + b, 0) / imcs.length : null;
    el("kpi-imc").textContent = imcMedio !== null ? imcMedio.toFixed(1) : "—";

    const aguardando = nomesAtivos.filter((n) => (contagemMedicoes[n] || 0) === 1).length;
    el("kpi-aguardando").textContent = aguardando;
  }

  /* ---------------- Frequência da turma (gráfico por mês) ---------------- */

  function renderizarFrequenciaTurma(nomesAtivos) {
    const nomesSet = new Set(nomesAtivos);
    const porMes = {};
    state.frequencia.forEach((f) => {
      const nome = (f["Nome Completo"] || "").trim();
      if (!nomesSet.has(nome)) return;
      const mes = f["Mês"];
      if (!mes) return;
      if (!porMes[mes]) porMes[mes] = { presencas: 0, faltas: 0 };
      porMes[mes].presencas += paraNumero(f["Presenças"]) || 0;
      porMes[mes].faltas += paraNumero(f["Faltas"]) || 0;
    });

    const meses = Object.keys(porMes).sort((a, b) => ordemMes(a) - ordemMes(b));
    const corMaroon = corCss("--brand-maroon", "#6b1414");

    if (chartFreqTurma) chartFreqTurma.destroy();
    chartFreqTurma = new Chart(el("chart-freq-turma").getContext("2d"), {
      type: "bar",
      data: {
        labels: meses,
        datasets: [{
          label: "% Presença da turma",
          data: meses.map((m) => {
            const { presencas, faltas } = porMes[m];
            const total = presencas + faltas;
            return total > 0 ? Math.round((presencas / total) * 100) : 0;
          }),
          backgroundColor: corMaroon,
          borderRadius: 6,
          maxBarThickness: 40,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + "%" } } },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => c.parsed.y + "% de presença da turma" } },
        },
      },
    });
  }

  /* ---------------- Ranking de frequência por aluno ---------------- */

  function montarRanking(nomesAtivos) {
    state.rankingCompleto = nomesAtivos
      .map((nome) => {
        const r = resumoFrequenciaAluno(state.frequencia, nome);
        return { nome, presencas: r.presencas, faltas: r.faltas, pct: r.pct };
      })
      .sort((a, b) => {
        if (a.pct === null && b.pct === null) return a.nome.localeCompare(b.nome, "pt-BR");
        if (a.pct === null) return 1;
        if (b.pct === null) return -1;
        return a.pct - b.pct;
      });
    renderizarTabelaRanking("");
  }

  function renderizarTabelaRanking(filtro) {
    const termo = filtro.trim().toLowerCase();
    const linhas = state.rankingCompleto.filter((r) => !termo || r.nome.toLowerCase().includes(termo));

    el("rank-tbody").innerHTML = linhas.map((r) => {
      const pctTexto = r.pct !== null ? Math.round(r.pct * 100) + "%" : "—";
      return `<tr>
        <td>${escapeHtml(r.nome)}</td>
        <td class="num">${r.presencas}</td>
        <td class="num">${r.faltas}</td>
        <td class="num">${pctTexto}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="4" style="color:var(--ink-soft);">Nenhum aluno encontrado.</td></tr>`;
  }

  /* ---------------- Bioimpedância da turma ---------------- */

  function renderizarMediasTurma(registros) {
    const media = (chave, fracao) => {
      const vals = registros.map((r) => (fracao ? paraFracao(r[chave]) : paraNumero(r[chave]))).filter((v) => v !== null && !isNaN(v));
      if (!vals.length) return null;
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };

    el("medias-turma-conteudo").innerHTML = METRICAS_BIO.map((m) => {
      const val = media(m.chave, m.fracao);
      if (val === null) return "";
      return `<div class="turma-row">
        <span class="turma-row__label">${m.label} — média da turma</span>
        <span class="turma-row__value">${formatarValor(m, val)}</span>
      </div>`;
    }).join("");
  }

  function distribuicaoClassificacao(registros, chave, mapaTom) {
    const contagem = {};
    registros.forEach((r) => {
      const texto = (r[chave] || "").trim();
      if (!texto) return;
      contagem[texto] = (contagem[texto] || 0) + 1;
    });
    const labels = Object.keys(contagem);
    const valores = labels.map((l) => contagem[l]);
    const cores = labels.map((l) => corTom((NOMADES_CONFIG.classificacoes[mapaTom] || {})[l] || ""));
    return { labels, valores, cores };
  }

  function renderizarDonut(canvasId, dist, chartRefAtual) {
    if (chartRefAtual) chartRefAtual.destroy();
    return new Chart(el(canvasId).getContext("2d"), {
      type: "doughnut",
      data: { labels: dist.labels, datasets: [{ data: dist.valores, backgroundColor: dist.cores, borderWidth: 0 }] },
      options: {
        cutout: "62%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }

  function renderizarLegenda(elId, dist) {
    el(elId).innerHTML = dist.labels.map((l, i) =>
      `<span><i style="background:${dist.cores[i]}"></i>${escapeHtml(l)} (${dist.valores[i]})</span>`
    ).join("");
  }

  function renderizarEvolucaoTurma(registrosBio, nomesAtivos) {
    const nomesSet = new Set(nomesAtivos);
    const porData = {};
    registrosBio.forEach((b) => {
      const nome = (b["Nome Completo"] || "").trim();
      if (!nomesSet.has(nome)) return;
      const d = parseDataBR(b["Data"]);
      if (!d) return;
      const chave = formatarDataBR(d);
      if (!porData[chave]) porData[chave] = { data: d, pesos: [] };
      const peso = paraNumero(b["Peso"]);
      if (peso !== null) porData[chave].pesos.push(peso);
    });

    const grupos = Object.values(porData).sort((a, b) => a.data - b.data);
    const bloco = el("bio-evolucao-bloco");

    if (grupos.length < 2) { bloco.style.display = "none"; return; }
    bloco.style.display = "block";

    const corMaroon = corCss("--brand-maroon", "#6b1414");

    if (chartEvolucao) chartEvolucao.destroy();
    chartEvolucao = new Chart(el("chart-evolucao-turma").getContext("2d"), {
      type: "line",
      data: {
        labels: grupos.map((g) => formatarDataBR(g.data)),
        datasets: [{
          label: "Peso médio (kg)",
          data: grupos.map((g) => g.pesos.length ? (g.pesos.reduce((a, b) => a + b, 0) / g.pesos.length) : null),
          borderColor: corMaroon,
          backgroundColor: corMaroon,
          tension: 0.3,
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { title: { display: true, text: "kg" } } },
      },
    });
  }

  function renderizarBioimpedanciaTurma(nomesAtivos) {
    const ultimaPorAluno = ultimaMedicaoPorAluno(state.bioimpedancia);
    const registros = nomesAtivos.map((n) => ultimaPorAluno[n]).filter(Boolean);

    const vazio = el("bio-turma-vazio");
    const conteudo = el("bio-turma-conteudo");

    if (registros.length === 0) {
      vazio.style.display = "block";
      conteudo.style.display = "none";
      return { ultimaPorAluno };
    }
    vazio.style.display = "none";
    conteudo.style.display = "block";

    renderizarMediasTurma(registros);

    const distImc = distribuicaoClassificacao(registros, "Classificação IMC", "imc");
    chartImcDist = renderizarDonut("chart-imc-dist", distImc, chartImcDist);
    renderizarLegenda("legenda-imc", distImc);

    const distVisceral = distribuicaoClassificacao(registros, "Classificação Visceral", "visceral");
    chartVisceralDist = renderizarDonut("chart-visceral-dist", distVisceral, chartVisceralDist);
    renderizarLegenda("legenda-visceral", distVisceral);

    renderizarEvolucaoTurma(state.bioimpedancia, nomesAtivos);

    return { ultimaPorAluno };
  }

  /* ---------------- Montagem geral ---------------- */

  function renderizarDashboard() {
    el("dash-atualizado").textContent = "Consulta em " + new Date().toLocaleDateString("pt-BR");

    const nomesAtivos = alunosAtivos(state.alunos).map((a) => a["Nome Completo"].trim());
    const contagemMedicoes = contarMedicoesPorAluno(state.bioimpedancia);

    const { ultimaPorAluno } = renderizarBioimpedanciaTurma(nomesAtivos);
    renderizarKpis(nomesAtivos, ultimaPorAluno, contagemMedicoes);
    renderizarFrequenciaTurma(nomesAtivos);
    montarRanking(nomesAtivos);
  }

  /* ---------------- Início ---------------- */

  async function iniciar() {
    mostrarSecao("carregando");
    try {
      await carregarDados();
      mostrarSecao("login");
    } catch (erro) {
      console.error(erro);
      el("erro-mensagem").textContent =
        "Não foi possível carregar os dados agora. Verifique sua internet e tente novamente em instantes.";
      mostrarSecao("erro");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    el("formulario-login-professor").addEventListener("submit", tratarLogin);
    el("link-sair-professor").addEventListener("click", sair);
    el("botao-tentar-de-novo").addEventListener("click", iniciar);
    el("busca-aluno").addEventListener("input", (e) => renderizarTabelaRanking(e.target.value));
    iniciar();
  });
})();
