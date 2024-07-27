// models/userModel.js

const mongoose = require('mongoose');

// Function to insert a new item

async function createMessage(item) {
        const db = await connectDB();
         const result = await db.collection('message').insertOne(item);
        
}

async function createUser(item) {
  const db = await connect();
   const result = await db.collection('users').insertOne(item);
  
}
async function createImage(item) {
  const db = await connectDB();
   const result = await db.collection('image').insertOne(item);
  
}
async function updateMessage(wa_id,status) {
  
  const db = await connect();
   await db.collection('message').updateOne(
                        { messageId:wa_id},
                        {
                          $set: {
                            "status": status.status,
                            "updatedAt": new Date(parseInt(status.timestamp)*1000)
                          }
                        }
                      );

}


async function getAllMessage() {
  const db = await connect();
  const data = await db.collection('message').find({}).sort({ createdAt: -1 }).toArray();
   return data;
 
}

module.exports = { createMessage,getAllMessage,updateMessage,createUser,createImage};


