const { generateText } = require("./gemini.service");
const { buildSoalInstruction } = require("../config/soalPrompt");

const HURUF = ["A", "B", "C", "D"];

function galat(pesan, status) {
  const err = new Error(pesan);
  err.status = status;
  return err;
}

// Buang pagar kode ```json ... ``` jika model tetap menambahkannya
function parseJson(text) {
  const bersih = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(bersih);
}

// Pastikan satu soal lengkap: pertanyaan, pilihan A-D, dan kunci jawaban valid
function normalisasiSoal(item) {
  if (!item || typeof item.pertanyaan !== "string" || !item.pertanyaan.trim()) {
    return null;
  }

  const p = item.pilihan;
  if (!p || typeof p !== "object") return null;

  const pilihan = {};
  for (const huruf of HURUF) {
    if (typeof p[huruf] !== "string" || !p[huruf].trim()) return null;
    pilihan[huruf] = p[huruf].trim();
  }

  const jawaban = String(item.jawaban || "").trim().toUpperCase();
  if (!HURUF.includes(jawaban)) return null;

  return {
    pertanyaan: item.pertanyaan.trim(),
    pilihan,
    jawaban,
    pembahasan: typeof item.pembahasan === "string" ? item.pembahasan.trim() : "",
  };
}

async function generateSoal(topik, jumlah) {
  const text = await generateText(
    `Topik dari guru: ${topik}\nJumlah soal: ${jumlah}`,
    buildSoalInstruction(jumlah),
    { responseMimeType: "application/json" }
  );

  if (!text || !text.trim()) {
    throw galat("Respons AI kosong", 502);
  }

  let data;
  try {
    data = parseJson(text);
  } catch {
    throw galat("Respons AI bukan JSON yang valid", 502);
  }

  if (data && data.error === "TOPIK_BUKAN_PAI") {
    throw galat("Topik bukan PAI", 422);
  }

  const daftar = data && Array.isArray(data.soal) ? data.soal : [];
  const soal = daftar.map(normalisasiSoal).filter(Boolean).slice(0, jumlah);

  if (soal.length === 0) {
    throw galat("Tidak ada soal valid dari AI", 502);
  }

  return soal;
}

module.exports = { generateSoal };