// Fungsi bantu yang dipakai ulang di beberapa bagian aplikasi.
const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka);

const formatUptime = (detik) => {
  const h = Math.floor(detik / 3600);
  const m = Math.floor((detik % 3600) / 60);
  const s = Math.floor(detik % 60);
  return `${h}j ${m}m ${s}d`;
};

module.exports = { formatRupiah, formatUptime };