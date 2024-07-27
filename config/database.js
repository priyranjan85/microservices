// db.js
/*
const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);


async function connect() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
  
      const database = client.db('whatsapp');
        return client.db('whatsapp');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = { connect };

*/

require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;
const mongoose = require('mongoose');

// MongoDB connection URI
const uri = `${DATABASE_URL}`;
console.log(uri);
// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;
