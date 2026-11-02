require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres', // 'postgres' atau 'mysql'
    logging: false, // ganti true jika ingin melihat query SQL di console
  }
);

// Tes koneksi: hanya jalan jika file ini dieksekusi langsung
if (require.main === module) {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Database terhubung lewat Sequelize');
      return sequelize.close();
    })
    .catch((err) => {
      console.error('Koneksi gagal:', err.message);
      process.exit(1);
    });
}

module.exports = sequelize;