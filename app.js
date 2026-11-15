require('dotenv').config();
const express = require('express');
const path = require('path');

const { port, appName } = require('./config/app.config');
const logger = require('./middlewares/logger');
const pageRoutes = require('./routes/page.routes');
const apiRoutes = require('./routes/api.routes');
const chatRoutes = require('./routes/chat.routes');
const materiRoutes = require('./routes/materi.routes');
const soalRoutes = require('./routes/soal.routes');
const pageController = require('./controllers/page.controller');

const app = express();

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware logger dipasang paling awal agar semua request tercatat
app.use(logger);

// Agar body JSON dari frontend terbaca di req.body
app.use(express.json());

// File statis (CSS, gambar, JS frontend) dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/ai', chatRoutes);
app.use('/api/ai', materiRoutes);
app.use('/api/ai', soalRoutes);
app.use('/api', apiRoutes);
app.use('/', pageRoutes);

// 404 handler (harus paling akhir)
app.use(pageController.notFound);

app.listen(port, () => {
  console.log(`${appName} berjalan di http://localhost:${port}`);
});