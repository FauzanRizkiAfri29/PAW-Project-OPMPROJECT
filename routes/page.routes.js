const express = require('express');
const pageController = require('../controllers/page.controller');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

router.get('/', pageController.home);
router.get('/chat', chatController.renderChatPage);

module.exports = router;