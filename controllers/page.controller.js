const ProdukModel = require('../models/produk.model');
const { appName } = require('../config/app.config');
const { formatRupiah, formatUptime } = require('../utils/format');

// GET /  -> halaman frontend (EJS) dengan data produk dari Model
exports.home = (req, res) => {
  res.render('index', {
    title: appName,
    produk: ProdukModel.getAll(),
    formatRupiah,
    uptime: formatUptime(process.uptime()),
  });
};

// 404 untuk halaman yang tidak ditemukan
exports.notFound = (req, res) => {
  res.status(404).render('404', { title: 'Halaman tidak ditemukan', path: req.originalUrl });
};