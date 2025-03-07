const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['pix', 'alimentos'], required: true },
  amount: { type: Number }, // valor usado para PIX
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);
