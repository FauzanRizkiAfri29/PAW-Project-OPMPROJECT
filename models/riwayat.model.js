const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabel riwayat: menyimpan materi dan soal yang sudah diperiksa guru (F-03).
// - jenis    : 'materi' atau 'soal'
// - isi      : materi = teks biasa; soal = JSON (daftar soal) dalam bentuk teks
// - untukKuis: penanda soal yang dipublikasikan sebagai kuis (dipakai pada langkah kuis)
const Riwayat = sequelize.define(
  'Riwayat',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    jenis: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: { isIn: [['materi', 'soal']] },
    },
    topik: { type: DataTypes.STRING(100), allowNull: false },
    isi: { type: DataTypes.TEXT, allowNull: false },
    untukKuis: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'untuk_kuis',
    },
  },
  { tableName: 'riwayat' }
);

module.exports = Riwayat;