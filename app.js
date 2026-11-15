const express = require('express');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const { port, appName } = require('./config/app.config');
const logger = require('./middlewares/logger');
const pageRoutes = require('./routes/page.routes');
const apiRoutes = require('./routes/api.routes');
const chatRoutes = require('./routes/chat.routes'); // BARU
const pageController = require('./controllers/page.controller');
const chatController = require('./controllers/chat.controller');

const app = express();

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/chat', chatController.renderChatPage);

// Middleware logger dipasang paling awal agar semua request tercatat
app.use(logger);

// BARU: agar body JSON dari frontend terbaca di req.body
app.use(express.json());

// Routes
app.use('/api/ai', chatRoutes);
app.use('/api', apiRoutes);
app.get('/chat', chatController.renderChatPage);
app.use('/', pageRoutes);

// 404 handler (harus paling akhir)
app.use(pageController.notFound);

app.listen(port, () => {
  console.log(`${appName} berjalan di http://localhost:${port}`);
});