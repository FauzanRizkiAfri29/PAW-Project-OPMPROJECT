const express = require('express');
const pageController = require('../controllers/page.controller');
const chatController = require('../controllers/chat.controller');
const materiController = require('../controllers/materi.controller');
const soalController = require('../controllers/soal.controller');
const riwayatController = require('../controllers/riwayat.controller');

const router = express.Router();

router.get('/', pageController.home);
router.get('/chat', chatController.renderChatPage);
router.get('/guru/materi', materiController.renderMateriPage);
router.get('/guru/soal', soalController.renderSoalPage);
router.get('/guru/riwayat', riwayatController.renderRiwayatPage);

module.exports = router;