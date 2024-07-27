const express = require('express');
const bodyParser = require('body-parser');
const { createMessage } = require('../models/messageWhatsapp');
const { connect } = require('../config/database');
const messageModel = require('../models/messageWhatsapp');
const app = express();
const PORT = process.env.PORT || 3000;
const processedMessages = new Set();

app.use(bodyParser.json());

async function sentWebhook(req, res) { 

	const data = req.body;


	if (data.object && data.entry) {

		data.entry.map(function(entry) {
			  entry.changes.map(function(change) {
                  
				  if (change.field == "messages" && change.value.statuses) {
					     change.value.statuses.map(function(status) {
                         
						 messageModel.updateMessage(status.id,status);
                         
						
					});
				} else if (change.field == "messages" && change.value.messages) { 
					       change.value.messages.map(function(message) {	
						               let status = "ok";
						                  // Any error
						                  if (message.errors) {
						                    status = "failed";
						                  }

						        var data1={ 
									                    "type": "received", // this is we received a message from the user
									                    "messageId": message.id, // message id that is from the received message object
									                    "contact": message.from, // user's phone number included country code
									                    "businessPhoneId":change.value.metadata.phone_number_id,
									                    "message": message, // message content whatever we received from the user
									 					"status": status,
									                    "createdAt":new Date()
								                  };
								messageModel.createMessage(data1);
							
					        });
				}								  

		
		
			});
		});


	}
  
	
}

module.exports = { sentWebhook}

