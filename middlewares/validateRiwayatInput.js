const { normalisasiSoal } = require('../services/soal.service');

const MIN_TOPIK = 3;
const MAX_TOPIK = 100;
const MAX_MATERI = 10000;
const MAX_SOAL = 10;

function tolak(res, pesan) {
  return res.status(400).json({ success: false, message: pesan });
}

function validateRiwayatInput(req, res, next) {
  const { jenis, topik, isi } = req.body || {};

  if (jenis !== 'materi' && jenis !== 'soal') {
    return tolak(res, "Jenis harus 'materi' atau 'soal'.");
  }

  if (typeof topik !== 'string' || topik.trim().length < MIN_TOPIK || topik.trim().length > MAX_TOPIK) {
    return tolak(res, `Topik wajib diisi, ${MIN_TOPIK}-${MAX_TOPIK} karakter.`);
  }

  if (jenis === 'materi') {
    if (typeof isi !== 'string' || isi.trim() === '') {
      return tolak(res, 'Isi materi wajib diisi.');
    }
    if (isi.length > MAX_MATERI) {
      return tolak(res, `Isi materi maksimal ${MAX_MATERI} karakter.`);
    }
    req.body.isi = isi.trim();
  } else {
    if (!Array.isArray(isi) || isi.length < 1 || isi.length > MAX_SOAL) {
      return tolak(res, `Isi soal harus berupa daftar 1-${MAX_SOAL} soal.`);
    }
    // Periksa ulang setiap soal agar data yang tersimpan selalu valid (A-D lengkap + kunci)
    const bersih = isi.map(normalisasiSoal);
    if (bersih.some((s) => s === null)) {
      return tolak(res, 'Format soal tidak valid.');
    }
    req.body.isi = JSON.stringify(bersih);
  }

  req.body.topik = topik.trim();
  next();
}

module.exports = validateRiwayatInput;