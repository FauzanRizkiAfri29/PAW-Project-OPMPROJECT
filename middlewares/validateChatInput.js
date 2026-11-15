const MAX_LENGTH = 500;
const MAX_CONTEXT = 3000;

function validateChatInput(req, res, next) {
  const { message } = req.body || {};

  if (typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Field 'message' wajib diisi dan berupa teks.",
    });
  }

  if (message.trim().length > MAX_LENGTH) {
    return res.status(400).json({
      success: false,
      message: `Pesan maksimal ${MAX_LENGTH} karakter.`,
    });
  }

    const { context } = req.body;
  if (context !== undefined && context !== null) {
    if (typeof context !== "string" || context.length > MAX_CONTEXT) {
      return res.status(400).json({
        success: false,
        message: `Field 'context' harus berupa teks maksimal ${MAX_CONTEXT} karakter.`,
      });
    }
  }

  req.body.message = message.trim();
  next();
}

module.exports = validateChatInput;