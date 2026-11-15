const { generateReply } = require("../services/gemini.service");
const { appName } = require("../config/app.config");

async function chat(req, res) {
  try {
    const reply = await generateReply(req.body.message, req.body.context);

    return res.status(200).json({
      success: true,
      data: { reply },
    });
  } catch (err) {
    console.error("Gemini error:", err.message);

    const status = Number(err.status || err.code);
    if (status === 503 || status === 429) {
      return res.status(503).json({
        success: false,
        message: "Layanan AI sedang sibuk. Silakan coba lagi beberapa saat.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memproses pertanyaan.",
    });
  }
}

function renderChatPage(req, res) {
  res.render("chat", { appName });
}

module.exports = { chat, renderChatPage };