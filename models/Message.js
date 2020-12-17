const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: String,
  userId: String,
}, {
  timestamps: true,
});

module.exports = { model:mongoose.model('Message', messageSchema), messageSchema }