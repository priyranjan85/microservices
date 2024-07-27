// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: null
  },
  permissions: [{
    type: String
  }]
});

module.exports = mongoose.model('User', userSchema);
