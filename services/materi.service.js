const { generateText } = require("./gemini.service");
const { buildMateriInstruction } = require("../config/materiPrompt");

async function generateMateri(topik) {
  const text = await generateText(
    `Topik dari guru: ${topik}`,
    buildMateriInstruction()
  );

  if (!text || !text.trim()) {
    throw new Error("Respons AI kosong");
  }

  // Model diminta membalas TOPIK_BUKAN_PAI jika topik di luar PAI
  if (text.trim().startsWith("TOPIK_BUKAN_PAI")) {
    const err = new Error("Topik bukan PAI");
    err.status = 422;
    throw err;
  }

  return text.trim();
}

module.exports = { generateMateri };