const { generateMateri } = require("../services/materi.service");

// POST /api/ai/materi
async function materi(req, res) {
  try {
    const hasil = await generateMateri(req.body.topik);

    return res.status(200).json({
      success: true,
      data: { materi: hasil },
    });
  } catch (err) {
    console.error("Materi error:", err.message);

    if (err.status === 422) {
      return res.status(422).json({
        success: false,
        message: "Topik harus seputar Pendidikan Agama Islam. Coba topik lain.",
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
      message: "Terjadi kesalahan saat membuat materi.",
    });
  }
}

// GET /guru/materi
function renderMateriPage(req, res) {
  res.render("materi", { title: "Buat Materi" });
}

module.exports = { materi, renderMateriPage };