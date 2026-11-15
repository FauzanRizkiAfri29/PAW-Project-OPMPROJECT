require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY belum diisi di file .env");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

module.exports = { ai, MODEL };