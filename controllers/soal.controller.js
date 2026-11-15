const { generateSoal } = require("../services/soal.service");

// POST /api/ai/soal
async function soal(req, res) {
  try {
    const { topik, jumlah } = req.body;
    const daftar = await generateSoal(topik, jumlah);

    return res.status(200).json({
      success: true,
      data: { topik, soal: daftar },
    });
  } catch (err) {
    console.error("Soal error:", err.message);

    if (err.status === 422) {
      return res.status(422).json({
        success: false,
        message: "Topik harus seputar Pendidikan Agama Islam. Coba topik lain.",
      });
    }

    if (err.status === 502) {
      return res.status(502).json({
        success: false,
        message: "AI belum menghasilkan soal yang valid. Silakan coba lagi.",
      });
    }

    const status = Number(err.status || err.code);
    if (status === 503 || status === 429) {
      return res.status(503).json({
        success: false,
        message: "Layanan AI sedang sibuk. Silakan coba lagi beberapa saat.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat soal.",
    });
  }
}

// GET /guru/soal
function renderSoalPage(req, res) {
  res.render("soal", { title: "Buat Soal" });
}

module.exports = { soal, renderSoalPage };