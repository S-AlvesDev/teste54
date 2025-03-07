// No arquivo admin.js

const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');  // Certifique-se de que o caminho está correto

const User = require('../models/users');
const Donation = require('../models/donation');

// Função para buscar as doações
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar doações' });
  }
};

// Listar todos os usuários
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter usuários' });
  }
});

// Atualizar dados de um usuário
router.put('/users/:id', verifyToken, isAdmin, async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// Excluir um usuário
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuário deletado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
});

// Rota para buscar as doações
router.get('/donation', getDonations);

module.exports = router; // Aqui você deve exportar o 'router' diretamente
