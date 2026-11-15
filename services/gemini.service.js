const { ai, MODEL } = require("../config/gemini");
const { buildSystemInstruction } = require("../config/aiPrompt");

const MAX_RETRY = 3;
const RETRYABLE_STATUS = [429, 500, 503];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fungsi umum: kirim isi + instruksi sistem ke Gemini, ulangi otomatis jika layanan sibuk.
// Dipakai bersama oleh chat, generator materi, dan generator soal.
async function generateText(contents, systemInstruction) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: { systemInstruction },
      });
      return response.text || null;
    } catch (err) {
      lastError = err;
      const status = Number(err.status || err.code);
      const bisaDiulang =
        RETRYABLE_STATUS.includes(status) ||
        /UNAVAILABLE|high demand/i.test(err.message || "");

      if (!bisaDiulang || attempt === MAX_RETRY) break;
      await sleep(attempt * 2000);
    }
  }

  throw lastError;
}

async function generateReply(message, context) {
  const text = await generateText(message, buildSystemInstruction(context));
  return (
    text ||
    "Maaf, aku belum bisa menjawab itu. Coba tanyakan dengan cara lain atau tanya Bapak/Ibu guru ya."
  );
}

module.exports = { generateText, generateReply };