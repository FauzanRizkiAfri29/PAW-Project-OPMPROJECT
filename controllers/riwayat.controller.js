const Riwayat = require('../models/riwayat.model');

const BATAS_DAFTAR = 50;

// Soal disimpan sebagai teks JSON, jadi diubah kembali ke array saat dikirim ke klien
function bentukItem(r, denganIsi) {
  const item = {
    id: r.id,
    jenis: r.jenis,
    topik: r.topik,
    untukKuis: r.untukKuis,
    dibuatPada: r.createdAt,
  };
  if (denganIsi) {
    item.isi = r.jenis === 'soal' ? JSON.parse(r.isi) : r.isi;
  }
  return item;
}

function parseId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Pesan yang ramah jika database belum menyala, bedakan dari error biasa
function tanganiError(res, err, pesanUmum) {
  console.error('Riwayat error:', err.message);
  if (/Connection|HostNotFound|AccessDenied/i.test(err.name || '')) {
    return res.status(503).json({
      success: false,
      message: 'Database belum tersedia. Hubungi admin atau coba lagi nanti.',
    });
  }
  return res.status(500).json({ success: false, message: pesanUmum });
}

// POST /api/riwayat
async function create(req, res) {
  try {
    const { jenis, topik, isi } = req.body;
    const r = await Riwayat.create({ jenis, topik, isi });
    return res.status(201).json({ success: true, data: bentukItem(r, false) });
  } catch (err) {
    return tanganiError(res, err, 'Gagal menyimpan ke riwayat.');
  }
}

// GET /api/riwayat?jenis=materi|soal
async function list(req, res) {
  try {
    const where = {};
    if (req.query.jenis === 'materi' || req.query.jenis === 'soal') {
      where.jenis = req.query.jenis;
    }
    const baris = await Riwayat.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: BATAS_DAFTAR,
    });
    return res.json({ success: true, data: baris.map((r) => bentukItem(r, false)) });
  } catch (err) {
    return tanganiError(res, err, 'Gagal memuat riwayat.');
  }
}

// GET /api/riwayat/:id
async function detail(req, res) {
  const id = parseId(req);
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID tidak valid.' });
  }
  try {
    const r = await Riwayat.findByPk(id);
    if (!r) {
      return res.status(404).json({ success: false, message: 'Riwayat tidak ditemukan.' });
    }
    return res.json({ success: true, data: bentukItem(r, true) });
  } catch (err) {
    return tanganiError(res, err, 'Gagal memuat riwayat.');
  }
}

// DELETE /api/riwayat/:id
async function remove(req, res) {
  const id = parseId(req);
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID tidak valid.' });
  }
  try {
    const terhapus = await Riwayat.destroy({ where: { id } });
    if (!terhapus) {
      return res.status(404).json({ success: false, message: 'Riwayat tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Riwayat dihapus.' });
  } catch (err) {
    return tanganiError(res, err, 'Gagal menghapus riwayat.');
  }
}

// GET /guru/riwayat -> halaman riwayat (EJS)
function renderRiwayatPage(req, res) {
  res.render('riwayat', { title: 'Riwayat' });
}

// PATCH /api/riwayat/:id/kuis  body: { untukKuis: true|false }
async function setKuis(req, res) {
  const id = parseId(req);
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID tidak valid.' });
  }
  const { untukKuis } = req.body || {};
  if (typeof untukKuis !== 'boolean') {
    return res.status(400).json({ success: false, message: 'untukKuis harus true atau false.' });
  }
  try {
    const r = await Riwayat.findByPk(id);
    if (!r) {
      return res.status(404).json({ success: false, message: 'Riwayat tidak ditemukan.' });
    }
    if (r.jenis !== 'soal') {
      return res.status(400).json({ success: false, message: 'Hanya soal yang bisa dijadikan kuis.' });
    }
    r.untukKuis = untukKuis;
    await r.save();
    return res.json({ success: true, data: bentukItem(r, false) });
  } catch (err) {
    return tanganiError(res, err, 'Gagal mengubah status kuis.');
  }
}

module.exports = { create, list, detail, remove, setKuis, renderRiwayatPage };