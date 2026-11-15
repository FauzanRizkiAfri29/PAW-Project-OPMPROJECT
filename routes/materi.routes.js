const express = require("express");
const router = express.Router();

const { materi } = require("../controllers/materi.controller");
const validateMateriInput = require("../middlewares/validateMateriInput");

router.post("/materi", validateMateriInput, materi);

module.exports = router;