const express = require('express');
const riwayatController = require('../controllers/riwayat.controller');
const validateRiwayatInput = require('../middlewares/validateRiwayatInput');

const router = express.Router();

router.post('/', validateRiwayatInput, riwayatController.create);
router.get('/', riwayatController.list);
router.get('/:id', riwayatController.detail);
router.delete('/:id', riwayatController.remove);
router.patch('/:id/kuis', riwayatController.setKuis);

module.exports = router;