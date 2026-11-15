const Riwayat = require('../models/riwayat.model');

const HURUF = ['A', 'B', 'C', 'D'];
const BATAS_DAFTAR = 50;

function parseId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Soal disimpan sebagai teks JSON; kembalikan null jika rusak
function bacaSoal(r) {
  try {
    const data = JSON.parse(r.isi);
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

function tanganiError(res, err, pesanUmum) {
  console.error('Kuis error:', err.message);
  if (/Connection|HostNotFound|AccessDenied/i.test(err.name || '')) {
    return res.status(503).json({
      success: false,
      message: 'Database belum tersedia. Hubungi guru atau coba lagi nanti.',
    });
  }
  return res.status(500).json({ success: false, message: pesanUmum });
}

// Hanya soal yang sudah dijadikan kuis oleh guru yang boleh diakses siswa
function cariKuis(id) {
  return Riwayat.findOne({ where: { id, jenis: 'soal', untukKuis: true } });
}

// GET /kuis -> halaman kuis (EJS)
function renderKuisPage(req, res) {
  res.render('kuis', { title: 'Kuis' });
}

// GET /api/kuis -> daftar kuis aktif
async function daftar(req, res) {
  try {
    const baris = await Riwayat.findAll({
      where: { jenis: 'soal', untukKuis: true },
      order: [['createdAt', 'DESC']],
      limit: BATAS_DAFTAR,
    });
    const data = baris
      .map((r) => ({ r, soal: bacaSoal(r) }))
      .filter((x) => x.soal)
      .map((x) => ({ id: x.r.id, topik: x.r.topik, jumlahSoal: x.soal.length }));
    return res.json({ success: true, data });
  } catch (err) {
    return tanganiError(res, err, 'Gagal memuat daftar kuis.');
  }
}

// GET /api/kuis/:id -> soal TANPA kunci jawaban dan pembahasan
async function ambil(req, res) {
  const id = parseId(req);
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID tidak valid.' });
  }
  try {
    const r = await cariKuis(id);
    const soal = r ? bacaSoal(r) : null;
    if (!soal) {
      return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan atau belum diaktifkan guru.' });
    }
    return res.json({
      success: true,
      data: {
        id: r.id,
        topik: r.topik,
        soal: soal.map((s) => ({ pertanyaan: s.pertanyaan, pilihan: s.pilihan })),
      },
    });
  } catch (err) {
    return tanganiError(res, err, 'Gagal memuat kuis.');
  }
}

// POST /api/kuis/:id/nilai  body: { jawaban: ['A', 'C', null, ...] }
async function nilai(req, res) {
  const id = parseId(req);
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID tidak valid.' });
  }
  const jawaban = req.body && req.body.jawaban;
  try {
    const r = await cariKuis(id);
    const soal = r ? bacaSoal(r) : null;
    if (!soal) {
      return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan atau belum diaktifkan guru.' });
    }

    const valid =
      Array.isArray(jawaban) &&
      jawaban.length === soal.length &&
      jawaban.every((j) => j === null || HURUF.includes(j));
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Format jawaban tidak valid.' });
    }

    const hasil = soal.map((s, i) => ({
      benar: jawaban[i] === s.jawaban,
      jawabanSiswa: jawaban[i],
      kunci: s.jawaban,
      pembahasan: s.pembahasan || '',
    }));
    const benar = hasil.filter((h) => h.benar).length;

    return res.json({
      success: true,
      data: {
        benar,
        total: soal.length,
        nilai: Math.round((benar / soal.length) * 100),
        hasil,
      },
    });
  } catch (err) {
    return tanganiError(res, err, 'Gagal menilai jawaban.');
  }
}

module.exports = { renderKuisPage, daftar, ambil, nilai };