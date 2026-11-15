const express = require("express");
const router = express.Router();

const { soal } = require("../controllers/soal.controller");
const validateSoalInput = require("../middlewares/validateSoalInput");

router.post("/soal", validateSoalInput, soal);

module.exports = router;