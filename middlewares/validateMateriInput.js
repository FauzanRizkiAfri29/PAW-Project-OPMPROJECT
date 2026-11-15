const MIN_TOPIK = 3;
const MAX_TOPIK = 100;

function validateMateriInput(req, res, next) {
  const { topik } = req.body || {};

  if (typeof topik !== "string" || topik.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Topik wajib diisi.",
    });
  }

  const bersih = topik.trim();
  if (bersih.length < MIN_TOPIK || bersih.length > MAX_TOPIK) {
    return res.status(400).json({
      success: false,
      message: `Topik harus ${MIN_TOPIK}-${MAX_TOPIK} karakter.`,
    });
  }

  req.body.topik = bersih;
  next();
}

module.exports = validateMateriInput;