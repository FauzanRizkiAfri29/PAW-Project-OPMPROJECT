const { ai, MODEL } = require("../config/gemini");
const { buildSystemInstruction } = require("../config/aiPrompt");

const MAX_RETRY = 3;
const RETRYABLE_STATUS = [429, 500, 503];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateReply(message, context) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: message,
        config: { systemInstruction: buildSystemInstruction(context) },
      });
      return (
        response.text ||
        "Maaf, aku belum bisa menjawab itu. Coba tanyakan dengan cara lain atau tanya Bapak/Ibu guru ya."
      );
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

module.exports = { generateReply };