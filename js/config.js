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
  }
};
