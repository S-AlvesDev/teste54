
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { verifyToken } = require('../middleware/authMiddleware');
const Donation = require('../models/donation');

// Criar doação (PIX ou alimentos)
router.post('/', verifyToken, async (req, res) => {
  const { type, amount } = req.body;
  try {
    const donation = new Donation({
      user: req.user.id,
      type,
      amount: type === 'pix' ? amount : undefined,
      status: 'pending'
    });
    await donation.save();
    res.json({ donation });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar doação' });
  }
});

// Gerar QR Code para PIX
router.get('/pix/qrcode', verifyToken, async (req, res) => {
  const { amount } = req.query;
  const pixKey = "123e4567-e89b-12d3-a456-426614174000"; // Exemplo de chave PIX
  const pixString = `pix;chave=${pixKey};valor=${amount}`;
  try {
    const qrCodeDataURL = await QRCode.toDataURL(pixString);
    res.json({ qrCode: qrCodeDataURL });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar QR Code' });
  }
});

// Listar doações do usuário autenticado
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user.id });
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter doações' });
  }
});

module.exports = router;
