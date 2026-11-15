const express = require('express');
const kuisController = require('../controllers/kuis.controller');

const router = express.Router();

router.get('/', kuisController.daftar);
router.get('/:id', kuisController.ambil);
router.post('/:id/nilai', kuisController.nilai);

module.exports = router;