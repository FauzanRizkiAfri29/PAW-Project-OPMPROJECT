// Middleware logger: mencatat method, path, status response, dan timestamp.
// Status baru diketahui setelah response selesai, jadi dicatat lewat event 'finish'.
const logger = (req, res, next) => {
  const mulai = Date.now();

  res.on('finish', () => {
    const waktu = new Date().toISOString();
    const durasi = Date.now() - mulai;
    console.log(
      `[${waktu}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durasi}ms)`
    );
  });

  next();
};

module.exports = logger;