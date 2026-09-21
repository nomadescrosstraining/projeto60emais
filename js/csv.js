/* =========================================================
   csv.js — leitor de CSV simples (sem depender de bibliotecas
   externas) + funções auxiliares de data e número, adaptadas ao
   jeito como o Planilhas Google exporta os dados publicados.
   ========================================================= */

/**
 * Faz o parse de um texto CSV para uma lista de objetos, usando a
 * primeira linha como cabeçalho. Lida com campos entre aspas
 * (inclusive com vírgulas ou quebras de linha dentro deles).
 */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ""; }
      else if (c === '\r') { /* ignora */ }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }

  const cleanRows = rows.filter(r => r.some(cell => String(cell).trim() !== ""));
  if (cleanRows.length === 0) return [];

  const headers = cleanRows[0].map(h => h.trim());
  return cleanRows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (r[idx] !== undefined ? r[idx].trim() : ""); });
    return obj;
  });
}

/** Busca uma URL publicada do Planilhas Google e devolve a lista de objetos. */
async function fetchCSV(url) {
  const bust = url.includes("?") ? "&" : "?";
  const res = await fetch(url + bust + "_=" + Date.now());
  if (!res.ok) throw new Error("Não foi possível carregar os dados (" + res.status + ")");
  const text = await res.text();
  return parseCSV(text);
}

/**
 * Converte uma data vinda da planilha em objeto Date, aceitando os
 * formatos mais comuns exportados pelo Google: AAAA-MM-DD,
 * DD/MM/AAAA e MM/DD/AAAA (com ou sem hora junto).
 */
function parseDataBR(value) {
  if (!value) return null;
  const v = String(value).trim().split(" ")[0];

  let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    // Sempre assume DD/MM/AAAA (padrão BR usado na planilha): primeiro
    // número é o dia, segundo é o mês — mesmo quando ambos são ≤ 12.
    const dia = Number(m[1]), mes = Number(m[2]), y = Number(m[3]);
    return new Date(y, mes - 1, dia);
  }

  const d = new Date(v);
  return isNaN(d) ? null : d;
}

/** Compara duas datas ignorando hora. */
function mesmaData(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function formatarDataBR(d) {
  if (!d) return "-";
  return d.toLocaleDateString("pt-BR");
}

/** Converte "0.408" ou "40.8" ou "40,8%" em número (fração 0-1) de forma tolerante. */
function paraFracao(value) {
  if (value === null || value === undefined || value === "") return null;
  let v = String(value).replace("%", "").replace(",", ".").trim();
  let n = parseFloat(v);
  if (isNaN(n)) return null;
  return n > 1 ? n / 100 : n;
}

function paraNumero(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = parseFloat(String(value).replace(",", "."));
  return isNaN(n) ? null : n;
}
