/* =========================================================
   demo-data.js — dados fictícios usados apenas em MODO
   DEMONSTRAÇÃO (quando o config.js ainda não tem os links reais
   da planilha). Nenhum dado real de aluno aparece aqui.
   ========================================================= */

const NOMADES_DEMO = {
  alunos: [
    { "Nome Completo": "Aluno Exemplo", "Data de Nascimento": "1960-05-20", "Ativo": "Sim" },
    { "Nome Completo": "Aluna Exemplo", "Data de Nascimento": "1958-11-03", "Ativo": "Sim" },
    { "Nome Completo": "Carlos Exemplo", "Data de Nascimento": "1955-02-10", "Ativo": "Sim" },
    { "Nome Completo": "Beatriz Exemplo", "Data de Nascimento": "1962-07-22", "Ativo": "Sim" },
    { "Nome Completo": "Osvaldo Exemplo", "Data de Nascimento": "1948-01-05", "Ativo": "Sim" },
    { "Nome Completo": "Marta Exemplo", "Data de Nascimento": "1957-09-14", "Ativo": "Sim" },
    { "Nome Completo": "Joaquim Exemplo", "Data de Nascimento": "1951-12-30", "Ativo": "Sim" },
    { "Nome Completo": "Rosa Exemplo", "Data de Nascimento": "1965-04-18", "Ativo": "Sim" },
    { "Nome Completo": "Helena Exemplo", "Data de Nascimento": "1960-03-25", "Ativo": "Sim" },
    { "Nome Completo": "Sebastião Exemplo", "Data de Nascimento": "1945-06-01", "Ativo": "Não" }
  ],

  frequencia: [
    { "Nome Completo": "Aluno Exemplo", "Mês": "06/26", "Presenças": "6", "Faltas": "1", "% Presença": "0.857" },
    { "Nome Completo": "Aluno Exemplo", "Mês": "07/26", "Presenças": "7", "Faltas": "0", "% Presença": "1" },
    { "Nome Completo": "Aluno Exemplo", "Mês": "08/26", "Presenças": "5", "Faltas": "2", "% Presença": "0.714" },
    { "Nome Completo": "Aluno Exemplo", "Mês": "09/26", "Presenças": "6", "Faltas": "1", "% Presença": "0.857" },

    { "Nome Completo": "Aluna Exemplo", "Mês": "06/26", "Presenças": "4", "Faltas": "3", "% Presença": "0.571" },
    { "Nome Completo": "Aluna Exemplo", "Mês": "07/26", "Presenças": "5", "Faltas": "2", "% Presença": "0.714" },
    { "Nome Completo": "Aluna Exemplo", "Mês": "08/26", "Presenças": "6", "Faltas": "1", "% Presença": "0.857" },
    { "Nome Completo": "Aluna Exemplo", "Mês": "09/26", "Presenças": "7", "Faltas": "0", "% Presença": "1" },

    { "Nome Completo": "Carlos Exemplo", "Mês": "06/26", "Presenças": "8", "Faltas": "0", "% Presença": "1" },
    { "Nome Completo": "Carlos Exemplo", "Mês": "07/26", "Presenças": "7", "Faltas": "1", "% Presença": "0.875" },
    { "Nome Completo": "Carlos Exemplo", "Mês": "08/26", "Presenças": "8", "Faltas": "0", "% Presença": "1" },
    { "Nome Completo": "Carlos Exemplo", "Mês": "09/26", "Presenças": "7", "Faltas": "1", "% Presença": "0.875" },

    { "Nome Completo": "Beatriz Exemplo", "Mês": "06/26", "Presenças": "3", "Faltas": "5", "% Presença": "0.375" },
    { "Nome Completo": "Beatriz Exemplo", "Mês": "07/26", "Presenças": "4", "Faltas": "4", "% Presença": "0.5" },
    { "Nome Completo": "Beatriz Exemplo", "Mês": "08/26", "Presenças": "3", "Faltas": "5", "% Presença": "0.375" },
    { "Nome Completo": "Beatriz Exemplo", "Mês": "09/26", "Presenças": "4", "Faltas": "4", "% Presença": "0.5" },

    { "Nome Completo": "Osvaldo Exemplo", "Mês": "06/26", "Presenças": "7", "Faltas": "1", "% Presença": "0.875" },
    { "Nome Completo": "Osvaldo Exemplo", "Mês": "07/26", "Presenças": "6", "Faltas": "2", "% Presença": "0.75" },
    { "Nome Completo": "Osvaldo Exemplo", "Mês": "08/26", "Presenças": "7", "Faltas": "1", "% Presença": "0.875" },
    { "Nome Completo": "Osvaldo Exemplo", "Mês": "09/26", "Presenças": "6", "Faltas": "2", "% Presença": "0.75" },

    { "Nome Completo": "Marta Exemplo", "Mês": "06/26", "Presenças": "5", "Faltas": "3", "% Presença": "0.625" },
    { "Nome Completo": "Marta Exemplo", "Mês": "07/26", "Presenças": "6", "Faltas": "2", "% Presença": "0.75" },
    { "Nome Completo": "Marta Exemplo", "Mês": "08/26", "Presenças": "5", "Faltas": "3", "% Presença": "0.625" },
    { "Nome Completo": "Marta Exemplo", "Mês": "09/26", "Presenças": "6", "Faltas": "2", "% Presença": "0.75" },

    { "Nome Completo": "Joaquim Exemplo", "Mês": "06/26", "Presenças": "8", "Faltas": "0", "% Presença": "1" },
    { "Nome Completo": "Joaquim Exemplo", "Mês": "07/26", "Presenças": "8", "Faltas": "0", "% Presença": "1" },
    { "Nome Completo": "Joaquim Exemplo", "Mês": "08/26", "Presenças": "7", "Faltas": "1", "% Presença": "0.875" },
    { "Nome Completo": "Joaquim Exemplo", "Mês": "09/26", "Presenças": "8", "Faltas": "0", "% Presença": "1" },

    { "Nome Completo": "Rosa Exemplo", "Mês": "06/26", "Presenças": "2", "Faltas": "6", "% Presença": "0.25" },
    { "Nome Completo": "Rosa Exemplo", "Mês": "07/26", "Presenças": "3", "Faltas": "5", "% Presença": "0.375" },
    { "Nome Completo": "Rosa Exemplo", "Mês": "08/26", "Presenças": "2", "Faltas": "6", "% Presença": "0.25" },
    { "Nome Completo": "Rosa Exemplo", "Mês": "09/26", "Presenças": "3", "Faltas": "5", "% Presença": "0.375" },

    { "Nome Completo": "Helena Exemplo", "Mês": "06/26", "Presenças": "6", "Faltas": "2", "% Presença": "0.75" },
    { "Nome Completo": "Helena Exemplo", "Mês": "07/26", "Presenças": "7", "Faltas": "1", "% Presença": "0.875" },
    { "Nome Completo": "Helena Exemplo", "Mês": "08/26", "Presenças": "6", "Faltas": "2", "% Presença": "0.75" },
    { "Nome Completo": "Helena Exemplo", "Mês": "09/26", "Presenças": "7", "Faltas": "1", "% Presença": "0.875" },

    { "Nome Completo": "Sebastião Exemplo", "Mês": "06/26", "Presenças": "4", "Faltas": "4", "% Presença": "0.5" }
  ],

  bioimpedancia: [
    { "Data": "2026-01-15", "Nome Completo": "Aluno Exemplo", "Altura": "1.72", "Peso": "82", "% Gordura": "0.35", "% Massa Magra": "0.28", "Gordura Visceral": "13", "Idade Metabólica": "58", "IMC": "27.7", "Classificação IMC": "Sobrepeso", "Classificação Visceral": "Elevado" },
    { "Data": "2026-07-20", "Nome Completo": "Aluno Exemplo", "Altura": "1.72", "Peso": "76", "% Gordura": "0.27", "% Massa Magra": "0.31", "Gordura Visceral": "9", "Idade Metabólica": "47", "IMC": "25.7", "Classificação IMC": "Sobrepeso", "Classificação Visceral": "Saudável/Normal" },

    { "Data": "2026-01-15", "Nome Completo": "Aluna Exemplo", "Altura": "1.58", "Peso": "65", "% Gordura": "0.38", "% Massa Magra": "0.26", "Gordura Visceral": "10", "Idade Metabólica": "55", "IMC": "26.0", "Classificação IMC": "Sobrepeso", "Classificação Visceral": "Elevado" },

    { "Data": "2026-01-15", "Nome Completo": "Carlos Exemplo", "Altura": "1.70", "Peso": "90", "% Gordura": "0.40", "% Massa Magra": "0.25", "Gordura Visceral": "16", "Idade Metabólica": "64", "IMC": "31.0", "Classificação IMC": "Obesidade", "Classificação Visceral": "Muito Elevado" },
    { "Data": "2026-07-20", "Nome Completo": "Carlos Exemplo", "Altura": "1.70", "Peso": "85", "% Gordura": "0.36", "% Massa Magra": "0.28", "Gordura Visceral": "13", "Idade Metabólica": "60", "IMC": "29.3", "Classificação IMC": "Sobrepeso", "Classificação Visceral": "Elevado" },

    { "Data": "2026-01-15", "Nome Completo": "Beatriz Exemplo", "Altura": "1.60", "Peso": "58", "% Gordura": "0.30", "% Massa Magra": "0.33", "Gordura Visceral": "7", "Idade Metabólica": "50", "IMC": "22.5", "Classificação IMC": "Peso Adequado", "Classificação Visceral": "Saudável/Normal" },
    { "Data": "2026-07-20", "Nome Completo": "Beatriz Exemplo", "Altura": "1.60", "Peso": "56", "% Gordura": "0.27", "% Massa Magra": "0.35", "Gordura Visceral": "6", "Idade Metabólica": "47", "IMC": "21.7", "Classificação IMC": "Peso Adequado", "Classificação Visceral": "Saudável/Normal" },

    { "Data": "2026-01-15", "Nome Completo": "Osvaldo Exemplo", "Altura": "1.78", "Peso": "95", "% Gordura": "0.32", "% Massa Magra": "0.30", "Gordura Visceral": "14", "Idade Metabólica": "66", "IMC": "29.8", "Classificação IMC": "Sobrepeso", "Classificação Visceral": "Elevado" },

    { "Data": "2026-01-15", "Nome Completo": "Marta Exemplo", "Altura": "1.61", "Peso": "70", "% Gordura": "0.34", "% Massa Magra": "0.29", "Gordura Visceral": "11", "Idade Metabólica": "60", "IMC": "27.0", "Classificação IMC": "Sobrepeso", "Classificação Visceral": "Elevado" },

    { "Data": "2026-01-15", "Nome Completo": "Joaquim Exemplo", "Altura": "1.73", "Peso": "68", "% Gordura": "0.22", "% Massa Magra": "0.40", "Gordura Visceral": "8", "Idade Metabólica": "52", "IMC": "22.7", "Classificação IMC": "Peso Adequado", "Classificação Visceral": "Saudável/Normal" },
    { "Data": "2026-07-20", "Nome Completo": "Joaquim Exemplo", "Altura": "1.73", "Peso": "66", "% Gordura": "0.20", "% Massa Magra": "0.42", "Gordura Visceral": "7", "Idade Metabólica": "49", "IMC": "22.1", "Classificação IMC": "Peso Adequado", "Classificação Visceral": "Saudável/Normal" },

    { "Data": "2026-01-15", "Nome Completo": "Rosa Exemplo", "Altura": "1.63", "Peso": "50", "% Gordura": "0.24", "% Massa Magra": "0.35", "Gordura Visceral": "6", "Idade Metabólica": "48", "IMC": "18.8", "Classificação IMC": "Baixo Peso", "Classificação Visceral": "Saudável/Normal" },

    { "Data": "2026-01-15", "Nome Completo": "Helena Exemplo", "Altura": "1.62", "Peso": "74", "% Gordura": "0.36", "% Massa Magra": "0.27", "Gordura Visceral": "12", "Idade Metabólica": "59", "IMC": "28.2", "Classificação IMC": "Sobrepeso", "Classificação Visceral": "Elevado" }
  ]
};

function estaEmDemonstracao() {
  return !NOMADES_CONFIG.csvAlunos || NOMADES_CONFIG.csvAlunos.startsWith("COLE_AQUI");
}
