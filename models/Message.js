const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageBody: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
},
}, {
  timestamps: true,
});

module.exports = { model:mongoose.model('Message', messageSchema), messageSchema }