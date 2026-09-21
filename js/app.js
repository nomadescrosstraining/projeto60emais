/* =========================================================
   app.js — Área do Aluno · Nômades Crosstraining
   Carrega os dados (planilha ou demonstração), cuida do login
   por nome + data de nascimento e desenha o painel do aluno.
   ========================================================= */

(function () {
  "use strict";

  const state = { alunos: [], frequencia: [], bioimpedancia: [], alunoAtual: null };
  let chartDonut = null, chartTrend = null, chartBio = null;

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
    const linkTrocar = el("link-trocar-aluno");
    if (linkTrocar) linkTrocar.style.display = nome === "dashboard" ? "" : "none";
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

  function popularSelect() {
    const select = el("select-aluno");
    const ativos = alunosAtivos(state.alunos)
      .sort((a, b) => a["Nome Completo"].localeCompare(b["Nome Completo"], "pt-BR"));

    select.innerHTML =
      '<option value="" disabled selected>Selecione seu nome</option>' +
      ativos.map((a) => {
        const nome = a["Nome Completo"].trim();
        return `<option value="${escapeHtml(nome)}">${escapeHtml(nome)}</option>`;
      }).join("");
  }

  function popularSeletoresDeData() {
    const selDia = el("select-dia");
    const selMes = el("select-mes");
    const selAno = el("select-ano");

    let opcoesDia = '<option value="" disabled selected>Dia</option>';
    for (let d = 1; d <= 31; d++) opcoesDia += `<option value="${d}">${d}</option>`;
    selDia.innerHTML = opcoesDia;

    let opcoesMes = '<option value="" disabled selected>Mês</option>';
    NOMES_MESES.forEach((nome, idx) => { opcoesMes += `<option value="${idx + 1}">${nome}</option>`; });
    selMes.innerHTML = opcoesMes;

    const anoAtual = new Date().getFullYear();
    let opcoesAno = '<option value="" disabled selected>Ano</option>';
    for (let a = anoAtual - 18; a >= anoAtual - 100; a--) opcoesAno += `<option value="${a}">${a}</option>`;
    selAno.innerHTML = opcoesAno;
  }

  /* ---------------- Login ---------------- */

  function mostrarErroLogin(msg) {
    const box = el("erro-login");
    box.textContent = msg;
    box.classList.add("is-visible");
  }
  function esconderErroLogin() {
    el("erro-login").classList.remove("is-visible");
  }

  function tratarLogin(evento) {
    evento.preventDefault();
    const nome = el("select-aluno").value;
    const dia = el("select-dia").value;
    const mes = el("select-mes").value;
    const ano = el("select-ano").value;

    if (!nome) { mostrarErroLogin("Selecione seu nome na lista."); return; }
    if (!dia || !mes || !ano) { mostrarErroLogin("Informe o dia, o mês e o ano do seu nascimento."); return; }

    const aluno = state.alunos.find((a) => (a["Nome Completo"] || "").trim() === nome);
    if (!aluno) { mostrarErroLogin("Não encontramos esse nome. Fale com a equipe da Nômades."); return; }

    const nascCadastro = parseDataBR(aluno["Data de Nascimento"]);
    const nascDigitada = new Date(Number(ano), Number(mes) - 1, Number(dia));

    if (!nascCadastro || !mesmaData(nascCadastro, nascDigitada)) {
      mostrarErroLogin("Data de nascimento não confere. Confira e tente de novo.");
      return;
    }

    esconderErroLogin();
    state.alunoAtual = nome;
    renderizarDashboard(nome);
    mostrarSecao("dashboard");
    window.scrollTo({ top: 0, behavior: "instant" in window.scrollTo ? "instant" : "auto" });
  }

  function trocarAluno(evento) {
    evento.preventDefault();
    state.alunoAtual = null;
    el("formulario-login").reset();
    esconderErroLogin();
    mostrarSecao("login");
  }

  /* ---------------- Dashboard: Frequência ---------------- */

  function renderizarFrequencia(nome) {
    const resumo = resumoFrequenciaAluno(state.frequencia, nome);
    const linhas = resumo.linhas;

    el("freq-pct").textContent = resumo.pct !== null ? Math.round(resumo.pct * 100) + "%" : "—";
    el("freq-presencas").textContent = resumo.presencas;
    el("freq-faltas").textContent = resumo.faltas;
    el("freq-total").textContent = resumo.total;

    const vazio = el("freq-vazio");
    const conteudo = el("freq-conteudo");

    if (linhas.length === 0) {
      conteudo.style.display = "none";
      vazio.style.display = "block";
      return;
    }
    conteudo.style.display = "";
    vazio.style.display = "none";

    const corMaroon = corCss("--brand-maroon", "#6b1414");
    const corLinha = corCss("--line", "#e3d9cb");

    if (chartDonut) chartDonut.destroy();
    chartDonut = new Chart(el("chart-donut").getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Presenças", "Faltas"],
        datasets: [{ data: [resumo.presencas, resumo.faltas], backgroundColor: [corMaroon, corLinha], borderWidth: 0 }],
      },
      options: {
        cutout: "68%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
      },
    });

    if (chartTrend) chartTrend.destroy();
    chartTrend = new Chart(el("chart-trend").getContext("2d"), {
      type: "bar",
      data: {
        labels: linhas.map((l) => l["Mês"]),
        datasets: [{
          label: "% Presença",
          data: linhas.map((l) => Math.round((paraFracao(l["% Presença"]) || 0) * 100)),
          backgroundColor: corMaroon,
          borderRadius: 6,
          maxBarThickness: 34,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + "%" } } },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => c.parsed.y + "% de presença" } },
        },
      },
    });
  }

  /* ---------------- Dashboard: Bioimpedância ---------------- */

  function linhaTabelaBio(m, primeira, atual) {
    const v1 = valorMetrica(m, primeira);
    const v2 = valorMetrica(m, atual);
    let deltaHtml = "-";
    if (v1 !== null && v2 !== null) {
      const diff = v2 - v1;
      const mostrado = m.fracao ? diff * 100 : diff;
      const seta = mostrado > 0.05 ? "▲" : mostrado < -0.05 ? "▼" : "▬";
      deltaHtml = `<span class="delta">${seta} ${mostrado >= 0 ? "+" : ""}${mostrado.toFixed(m.casas)}${m.unidade}</span>`;
    }
    return `<tr>
      <td class="metric-name">${m.label}</td>
      <td class="num">${formatarValor(m, v1)}</td>
      <td class="num">${formatarValor(m, v2)}${badgeClassificacao(m, atual)}</td>
      <td class="num">${deltaHtml}</td>
    </tr>`;
  }

  function cartaoUnicaAvaliacao(u) {
    return METRICAS_BIO.map((m) => {
      const v = valorMetrica(m, u);
      return `<div class="turma-row">
        <span class="turma-row__label">${m.label}</span>
        <span class="turma-row__value">${formatarValor(m, v)}${badgeClassificacao(m, u)}</span>
      </div>`;
    }).join("");
  }

  function renderizarBioimpedancia(nome) {
    const linhas = state.bioimpedancia
      .filter((b) => (b["Nome Completo"] || "").trim() === nome)
      .map((b) => Object.assign({}, b, { _data: parseDataBR(b["Data"]) }))
      .filter((b) => b._data)
      .sort((a, b) => a._data - b._data);

    const vazio = el("bio-vazio");
    const aguardando = el("bio-aguardando");
    const conteudo = el("bio-conteudo");

    if (linhas.length === 0) {
      vazio.style.display = "block";
      aguardando.style.display = "none";
      conteudo.style.display = "none";
      return;
    }
    vazio.style.display = "none";

    if (linhas.length === 1) {
      aguardando.style.display = "block";
      conteudo.style.display = "none";
      el("bio-unica-data").textContent = formatarDataBR(linhas[0]._data);
      el("bio-unica-corpo").innerHTML = cartaoUnicaAvaliacao(linhas[0]);
      return;
    }

    aguardando.style.display = "none";
    conteudo.style.display = "block";

    const primeira = linhas[0];
    const atual = linhas[linhas.length - 1];

    el("bio-periodo").textContent =
      "1ª avaliação em " + formatarDataBR(primeira._data) + " → avaliação atual em " + formatarDataBR(atual._data);

    el("bio-tbody").innerHTML = METRICAS_BIO.map((m) => linhaTabelaBio(m, primeira, atual)).join("");

    const corMaroon = corCss("--brand-maroon", "#6b1414");

    if (chartBio) chartBio.destroy();
    chartBio = new Chart(el("chart-bio").getContext("2d"), {
      type: "line",
      data: {
        labels: linhas.map((l) => formatarDataBR(l._data)),
        datasets: [{
          label: "Peso (kg)",
          data: linhas.map((l) => paraNumero(l["Peso"])),
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
        scales: { y: { title: { display: true, text: "Peso (kg)" } } },
      },
    });
  }

  /* ---------------- Dashboard: Comparação com a turma ---------------- */

  function renderizarComparacaoTurma(nome) {
    const card = el("card-turma");
    const porAluno = ultimaMedicaoPorAluno(state.bioimpedancia);

    const registros = Object.values(porAluno);
    if (registros.length < 3 || !porAluno[nome]) { card.style.display = "none"; return; }
    card.style.display = "";

    const media = (chave, fracao) => {
      const vals = registros.map((r) => (fracao ? paraFracao(r[chave]) : paraNumero(r[chave]))).filter((v) => v !== null);
      if (!vals.length) return null;
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };

    const linhasComparar = [
      { chave: "Peso", label: "Peso", unidade: " kg", casas: 1 },
      { chave: "IMC", label: "IMC", unidade: "", casas: 1 },
      { chave: "% Gordura", label: "% Gordura", unidade: "%", casas: 1, fracao: true },
      { chave: "Gordura Visceral", label: "Gordura Visceral", unidade: "", casas: 0 },
    ];

    const meu = porAluno[nome];
    el("turma-conteudo").innerHTML = linhasComparar.map((l) => {
      const mediaVal = media(l.chave, l.fracao);
      const meuVal = l.fracao ? paraFracao(meu[l.chave]) : paraNumero(meu[l.chave]);
      if (mediaVal === null || meuVal === null) return "";
      return `<div class="turma-row">
        <span class="turma-row__label">${l.label} — você / média da turma</span>
        <span class="turma-row__value">${formatarValor(l, meuVal)} / ${formatarValor(l, mediaVal)}</span>
      </div>`;
    }).join("");
  }

  function renderizarDashboard(nome) {
    el("dash-nome").textContent = nome;
    el("dash-atualizado").textContent = "Consulta em " + new Date().toLocaleDateString("pt-BR");
    renderizarFrequencia(nome);
    renderizarBioimpedancia(nome);
    renderizarComparacaoTurma(nome);
  }

  /* ---------------- Início ---------------- */

  async function iniciar() {
    mostrarSecao("carregando");
    try {
      await carregarDados();
      popularSelect();
      popularSeletoresDeData();
      mostrarSecao("login");
    } catch (erro) {
      console.error(erro);
      el("erro-mensagem").textContent =
        "Não foi possível carregar os dados agora. Verifique sua internet e tente novamente em instantes.";
      mostrarSecao("erro");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    el("formulario-login").addEventListener("submit", tratarLogin);
    el("link-trocar-aluno").addEventListener("click", trocarAluno);
    el("botao-tentar-de-novo").addEventListener("click", iniciar);
    iniciar();
  });
})();
