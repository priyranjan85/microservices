// models/User.js
const mongoose =require('../config/database');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
 
});

const Image = mongoose.model('Image', userSchema);

module.exports = Image;
