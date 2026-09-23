/* =========================================================
   CONFIGURAÇÃO DO SITE — Área do Aluno · Nômades Crosstraining
   =========================================================
   Troque as três URLs abaixo pelos links "Publicado na Web em CSV"
   das abas da sua Planilha Google. O passo a passo completo está
   no GUIA.md que acompanha este projeto.

   Enquanto as URLs estiverem como "COLE_AQUI...", o site funciona
   sozinho em MODO DEMONSTRAÇÃO, com um aluno fictício, só para você
   ver o layout funcionando antes de ligar os dados de verdade.
   ========================================================= */

const NOMADES_CONFIG = {
  // Aba "Site_Alunos": Nome Completo | Data de Nascimento | Ativo
  csvAlunos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBzDO1EkVg4Sbz-vfcM8Nk8uMzIDLUy_hlmiJ4YVUvVOrQ0KtjGqt-RkOAXFrk1A/pub?gid=837236638&single=true&output=csv",

  // Aba "Site_Frequencia": Nome Completo | Mês | Presenças | Faltas | % Presença
  csvFrequencia: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBzDO1EkVg4Sbz-vfcM8Nk8uMzIDLUy_hlmiJ4YVUvVOrQ0KtjGqt-RkOAXFrk1A/pub?gid=1632767414&single=true&output=csv",

  // Aba "Bioimpedancia" (a mesma que você já usa): Data | Nome Completo | Altura |
  // Peso | % Gordura | % Massa Magra | Gordura Visceral | Idade Metabólica | IMC |
  // Classificação IMC | Classificação Visceral
  csvBioimpedancia: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBzDO1EkVg4Sbz-vfcM8Nk8uMzIDLUy_hlmiJ4YVUvVOrQ0KtjGqt-RkOAXFrk1A/pub?gid=1355507298&single=true&output=csv",

  // Senha única da Área do Professor (visão geral da turma).
  // Isto NÃO é uma senha forte: como o site é só HTML/JS estático, qualquer
  // pessoa que abrir o código-fonte da página consegue ler este valor. Ela
  // serve para afastar visitantes curiosos, não para proteger dados sigilosos
  // — e é mais um motivo para nunca publicar a aba "Fichas" (veja o GUIA.md).
  senhaProfessor: "descansanoburpee",

  // Como as classificações de texto da planilha viram cor no site.
  // Se você criar uma classificação nova na planilha que não está aqui,
  // ela aparece sem cor (neutra) até você adicionar a linha correspondente.
  classificacoes: {
    imc: {
      "Peso Adequado": "good",
      "Baixo Peso": "warn",
      "Sobrepeso": "warn",
      "Obesidade": "bad",
      "Obesidade Grau I": "bad",
      "Obesidade Grau II": "bad",
      "Obesidade Grau III": "bad"
    },
    visceral: {
      "Saudável/Normal": "good",
      "Elevado": "warn",
      "Muito Elevado": "bad"
    }
  },

  // Ordem de gravidade de cada classificação (0 = melhor classificação
  // possível, números maiores = mais grave). Usada para decidir a COR da
  // variação na tabela do aluno: se a nova avaliação caiu para um número
  // menor que a anterior, a variação aparece em verde (mudou de faixa pra
  // melhor); se subiu, aparece em vermelho; se ficou na mesma faixa (ex.:
  // "Sobrepeso" nas duas vezes), o site ainda olha se o número andou na
  // direção da faixa ideal pra decidir a cor. Se adicionar uma
  // classificação nova acima, adicione a ordem dela aqui também (mesmo
  // texto, mesmo mapa "imc"/"visceral").
  // Cor própria de cada classificação (usada nos gráficos donut da Área do
  // Professor e nos pontos do gráfico de evolução) — resolve um problema
  // visual real: como o IMC tem 7 classificações mas só 3 tons (bom/atenção/
  // elevado), "Baixo Peso" e "Sobrepeso" ficavam com a MESMA cor no gráfico
  // (os dois são "atenção"), e as 4 faixas de obesidade também ficavam todas
  // idênticas (todas "elevado") — impossível distinguir as fatias do donut.
  // Aqui cada classificação ganha seu próprio tom dentro da família certa,
  // formando um degradê de gravidade: verde (ideal) → dourado (abaixo do
  // peso) → âmbar (sobrepeso) → laranja → vermelho → vermelho mais escuro,
  // terminando no marrom mais profundo da marca (obesidade grau III). Se
  // você criar uma classificação nova e não adicionar uma cor aqui, ela usa
  // a cor do tom (igual sempre funcionou) até você cadastrar uma cor própria.
  coresClassificacao: {
    imc: {
      "Peso Adequado": "#2f6b46",
      "Baixo Peso": "#b6841e",
      "Sobrepeso": "#93601a",
      "Obesidade": "#ad5324",
      "Obesidade Grau I": "#a53324",
      "Obesidade Grau II": "#872318",
      "Obesidade Grau III": "#5c150d"
    },
    visceral: {
      "Saudável/Normal": "#2f6b46",
      "Elevado": "#93601a",
      "Muito Elevado": "#a53324"
    }
  },

  classificacoesOrdem: {
    imc: {
      "Peso Adequado": 0,
      "Baixo Peso": 1,
      "Sobrepeso": 1,
      "Obesidade": 2,
      "Obesidade Grau I": 2,
      "Obesidade Grau II": 3,
      "Obesidade Grau III": 4
    },
    visceral: {
      "Saudável/Normal": 0,
      "Elevado": 1,
      "Muito Elevado": 2
    }
  },

  // Comparação "idade real x idade metabólica": a partir de quantos anos
  // de diferença a mensagem muda de tom. Com os valores abaixo:
  //   metabólica menor que a real            → verde (ótimo sinal)
  //   metabólica igual à real                 → neutro
  //   metabólica até 3 anos acima da real      → amarelo (atenção)
  //   metabólica mais de 3 anos acima da real  → vermelho
  idadeMetabolica: {
    toleranciaAtencao: 3
  }
};
