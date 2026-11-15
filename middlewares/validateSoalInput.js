const MIN_TOPIK = 3;
const MAX_TOPIK = 100;
const MIN_JUMLAH = 1;
const MAX_JUMLAH = 10;
const DEFAULT_JUMLAH = 5;

function validateSoalInput(req, res, next) {
  const { topik, jumlah } = req.body || {};

  if (typeof topik !== "string" || topik.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Topik wajib diisi.",
    });
  }

  const bersih = topik.trim();
  if (bersih.length < MIN_TOPIK || bersih.length > MAX_TOPIK) {
    return res.status(400).json({
      success: false,
      message: `Topik harus ${MIN_TOPIK}-${MAX_TOPIK} karakter.`,
    });
  }

  // Jumlah soal opsional; jika kosong dipakai nilai bawaan
  let jumlahFinal = DEFAULT_JUMLAH;
  if (jumlah !== undefined && jumlah !== null && jumlah !== "") {
    jumlahFinal = Number(jumlah);
    if (!Number.isInteger(jumlahFinal) || jumlahFinal < MIN_JUMLAH || jumlahFinal > MAX_JUMLAH) {
      return res.status(400).json({
        success: false,
        message: `Jumlah soal harus bilangan bulat ${MIN_JUMLAH}-${MAX_JUMLAH}.`,
      });
    }
  }

  req.body.topik = bersih;
  req.body.jumlah = jumlahFinal;
  next();
}

module.exports = validateSoalInput;