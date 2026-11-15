const ProdukModel = require('../models/produk.model');
const { formatUptime } = require('../utils/format');

// GET /  -> halaman beranda (EJS) dengan data fitur dari Model
exports.home = (req, res) => {
  res.render('index', {
    title: 'Beranda',
    produk: ProdukModel.getAll(),
    uptime: formatUptime(process.uptime()),
  });
};

// 404 untuk halaman yang tidak ditemukan
exports.notFound = (req, res) => {
  res.status(404).render('404', { title: 'Halaman tidak ditemukan', path: req.originalUrl });
};