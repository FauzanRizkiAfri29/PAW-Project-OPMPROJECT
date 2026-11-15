const express = require("express");
const router = express.Router();

const { chat } = require("../controllers/chat.controller");
const validateChatInput = require("../middlewares/validateChatInput");

router.post("/chat", validateChatInput, chat);

module.exports = router;