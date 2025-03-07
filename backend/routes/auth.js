const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/users');

// Registro de usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }
    user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
