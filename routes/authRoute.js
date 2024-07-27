// routes/authRoute.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
router.post(
  '/register',
  // Validation rules
  [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isEmail().withMessage('Email is invalid')
      .normalizeEmail()
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
     
  
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      permissions=['send_message',
                    'create_templates',
                    'create_templates',
                    'send_attachment',
                    'get_templates',
                    'write_data',
                    'sendMessageTemplate'];
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists. Please choose a different username.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        password: hashedPassword,
        permissions
      });

      await user.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Provide a secret key for signing the token
      const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET || 'your_secret_key');
  
      // Update user's accessToken in the database
      user.accessToken = accessToken;
      await user.save();
  
      res.json({ accessToken });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

module.exports = router;
