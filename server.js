const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./backend/config/db');

// Importa as rotas
const authRoutes = require('./backend/routes/auth');
const donationRoutes = require('./backend/routes/donation');
const adminRoutes = require('./backend/routes/admin'); // Certifique-se de que o caminho está correto

const app = express();

// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes); // Use as rotas de admin corretamente

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
