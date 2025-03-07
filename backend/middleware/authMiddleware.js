const jwt = require('jsonwebtoken');
const User = require('../models/users'); // Certifique-se de que o caminho está correto

const verifyToken = (req, res, next) => {  
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ message: 'Acesso negado!' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token inválido!' });
    }
};

// Verifica se o usuário é administrador
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso restrito' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erro interno' });
  }
};

// Agora, exporte as duas funções
module.exports = { verifyToken, isAdmin };
