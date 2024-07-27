  
const axios = require('axios');
const { connect } = require('../config/database');
const messageModel = require('../models/messageWhatsapp');
const imageUpload = require('../models/imageUpload');
const helper = require('../helper');
const path = require('path');
const fs = require('fs');

const multer = require('multer');

require('dotenv').config();
const apiUrl = process.env.WHATSAPP_URL;
const senderId = process.env.SENDER_ID;
const accessToken = process.env.WHATSAPP_TOKEN;
const sender_business_id = process.env.SENDER_BUSINESS_ID;
const country_code = process.env.COUNTRY_CODE;
const sender_user_id = process.env.SENDER_USER_ID;


//@desc Get Service Request Example
//@route GET /api/home
//@access public
const sendTemplate = (req, res) => {
    const mobile_no = req.phone;
       
    createMessage(data);


}



async function sendMessage(req, res) { 

    const { phone, message} = req.body;
       
    isPhoneValid = helper.validatePhone(phone);
    isMessageValid = helper.validateMessage(message);

  
    if (isPhoneValid && isMessageValid) {

        axios.post(`${apiUrl}/${sender_business_id}/messages`, {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: country_code+phone,
            type: 'text',
            text: JSON.stringify({
                preview_url: false,
                body: message
            }),
            access_token:accessToken
        }).then(function (response) {

            const all_message= { 
                                    "type": "sent", // this is we received a message from the user
                                    "messageId":response.data.messages[0].id, // message id that is from the received message object
                                    "contact": response.data.contacts[0].input, // user's phone number included country code
                                  
                                    "message": message, // message content whatever we received from the user
                 					"status": 'sent',
                                    "createdAt":new Date()
                              };
            //messageModel.createMessage(all_message);
            res.status(200).json({message:response.data});
       
           
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                
       
                res.status(error.response.status).json({message: error.response.data});
             
            } else if (error.request) {
                // The request was made but no response was received
           
                res.status(400).json({message:error.request});
             
            } else {
                // Something happened in setting up the request that triggered an Error
                res.status(400).json({message:error.message});
            }
        });
    } else {
        const errors = [];
        if (!isPhoneValid) errors.push("Invalid phone number.");
        if (!isMessageValid) errors.push("Invalid message.");
        if (!isBusinessPhoneIdValid) errors.push("Invalid business_phone_id.");
        if (!iscountryCode) errors.push("Invalid Country Code is not exist");
        
        
        res.status(400).json({ valid: false, errors });
    }


    
    
     
}

const sendLocation = (req, res) => {

    

    const { phone,longitude, latitude,name,address,country_code,business_phone_id} = req.body;
           
        isPhoneValid = helper.validatePhone(phone);
        iscountryCode = helper.countryCode(country_code);
        isBusinessPhoneIdValid = helper.validateBusinessPhoneId(business_phone_id);
            
     if(isPhoneValid && iscountryCode && isBusinessPhoneIdValid && longitude && latitude && name &&address )  
       {     
        axios.post(`${apiUrl}/${business_phone_id}/messages`, {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: country_code+phone,
            type: 'location',
            "location": {
                "longitude":longitude,
                "latitude":latitude,
                "name": name,
                "address": address
              },
            access_token:accessToken
        }).then(function (response) {

            const all_message= { 
                                    "type": "sent", // this is we received a message from the user
                                    "messageId":response.data.messages[0].id, // message id that is from the received message object
                                    "contact": response.data.contacts[0].input, // user's phone number included country code
                                    "businessPhoneId":business_phone_id,
                                    "message": "Location sent", // message content whatever we received from the user
                 					"status": 'sent',
                                    "createdAt":new Date()
                              };
            messageModel.createMessage(all_message);
            res.status(response.status).json({message:response.data});
           
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                res.status(error.response.status).json({message: error.response.data});
             
            } else if (error.request) {
                // The request was made but no response was received
            
                res.status(400).json({message:error.request});
             
            } else {
                // Something happened in setting up the request that triggered an Error

                res.status(400).json({message:error.message});
            }
        });
    }else{

        const errors = [];
     
        if (!isPhoneValid) errors.push("Invalid phone number.");
        if (!longitude) errors.push("Longitude Should not be empty");
        if (!latitude) errors.push("Latitude Should not be empty");
        if (!name) errors.push("Name Should not be empty");
        if (!address) errors.push("Address Should not be empty");
        if (!isBusinessPhoneIdValid) errors.push("Invalid business_phone_id.");
        if (!iscountryCode) errors.push("Invalid Country Code is not exist");
        
        
        res.status(400).json({ valid: false, errors });



    } 

    
}
const sendContact = (req, res) => {

   
  
    const { sender_phone,name,client_phone,business_phone_id,country_code} = req.body;



    isSenderValid          = helper.validatePhone(sender_phone);
    isClientValid          = helper.validatePhone(client_phone);
    iscountryCode          = helper.countryCode(country_code);
    isBusinessPhoneIdValid = helper.validateBusinessPhoneId(business_phone_id);
        
 if(isSenderValid && isClientValid && iscountryCode && isBusinessPhoneIdValid  && name )  
   { 
            const allMessage=req.body;
            allMessage.sender_id=senderId;
            allMessage.reciver_id=sender_phone;
            allMessage.type='contact';

        axios.post(`${apiUrl}/${business_phone_id}/messages`, {
            
                "messaging_product": "whatsapp",
                "to":country_code+sender_phone,
                "type": "contacts",
                "contacts": [
                  {
                    "name": {
                      "formatted_name": name,
                    
                      "suffix": "SUFFIX",
                      "prefix": "PREFIX"
                    },
                    "phones": [
                      {
                        "phone":country_code+client_phone ,
                        "type": "HOME"
                      }
                    ]
                  }
                ],
            
            access_token:accessToken
        }).then(function (response) {

            const all_message= { 
                                    "type": "sent", // this is we received a message from the user
                                    "messageId":response.data.messages[0].id, // message id that is from the received message object
                                    "contact": response.data.contacts[0].input, // user's phone number included country code
                                    "businessPhoneId":business_phone_id,
                                    "message": "Contact has been sent", // message content whatever we received from the user
                 					"status": 'sent',
                                    "createdAt":new Date()
                              };
            messageModel.createMessage(all_message);
            res.status(response.status).json({message:response.data});
           
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                res.status(error.response.status).json({message: error.response.data});
             
            } else if (error.request) {
                // The request was made but no response was received
   
                res.status(400).json({message:error.request});
           
             
            } else {
                // Something happened in setting up the request that triggered an Error
      
                res.status(400).json({message:error.message});
            }
        });
   }else{

            const errors = [];
            if (!isSenderValid) errors.push("Invalid Sender Phone number.");
            if (!isClientValid) errors.push("Invalid Client Phone number.");
            if (!iscountryCode) errors.push("Invalid Country Code.");
            if (!name) errors.push("Name Should not be empty");
            if (!isBusinessPhoneIdValid) errors.push("Invalid Valid Business Phone number");
           
            
            res.status(400).json({ valid: false, errors });

   }    
    
}


async function sendPDF(req, res) {

    const { phone, link} = req.body;

    isPhoneValid = helper.validatePhone(phone);
 
    console.log("PDF URL",helper.isPDF(link))

    if(!await helper.isPDF(link)){

        res.status(400).json({message:"PDF is not exist"});
        return false;
    }


    if (isPhoneValid ) {
        try {

            const path = require('path');
            const filename = path.basename(link);
      
            const response = await axios.post(`${apiUrl}/${sender_business_id}/messages`, {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: country_code + phone,
                type: 'document',
                document: {
                    link: link,
                    filename: filename
                },
                access_token: accessToken
            });
            

        
            res.status(response.status).json({message: response.data});
           
        } catch (error) {
            var error_log='';
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                error_log=error.response.data;
                res.status(error.response.status).json({message: error.response.data});
             
            } else if (error.request) {
                // The request was made but no response was received
                error_log=error.request;
                res.status(400).json({message:error.request});
             
            } else {
                // Something happened in setting up the request that triggered an Error
                error_log=error.message;
                res.status(400).json({message:error.message});
            }

        }
    }else{

        const errors = [];

        
        res.status(400).json({ valid: false, errors });
    }    
}


async function sendAttachment(req, res) {



    const { phone, link,type} = req.body;
   

    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
     
     if(type!=helper.getFileType(link)){
        res.status(400).json({message: "Please correct media type"});

     }

     if(! await  helper.validateImageSizeFromURL(link, maxSizeInBytes) ){
        res.status(400).json({message: "Please media size is less than 2 MB"});
     }

 


    isPhoneValid = helper.validatePhone(phone);
 
   
    if (isPhoneValid ) {
   

      const message={
                            messaging_product: 'whatsapp',
                            recipient_type: 'individual',
                            to: country_code + phone,
                            type: type,
                            access_token: accessToken
                      };

               console.log(message);       
        if (type === 'image') {
        message.image = JSON.stringify({ link: link });
        } else if (type === 'video') {
            message.video = JSON.stringify({ link: link });
        }else if(type==='audio'){
            message.audio = JSON.stringify({ link: link });

        }
               console.log(`${apiUrl}/${sender_business_id}/messages`);
                        
        axios.post(`${apiUrl}/${sender_business_id}/messages`,message).then(function (response) {
            // const all_message= { 
            //                         "type": "sent", // this is we received a message from the user
            //                         "messageId":response.data.messages[0].id, // message id that is from the received message object
            //                         "contact": response.data.contacts[0].input, // user's phone number included country code
            //                         "businessPhoneId":business_phone_id,
            //                                 // message content whatever we received from the user
            //      					"status": 'sent',
            //                         "createdAt":new Date()
            //                   };
            // messageModel.createMessage(all_message);
            res.status(response.status).json({message: response.data});
           
        }).catch(function (error) {
            var error_log='';
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                error_log=error.response.data;
                res.status(error.response.status).json({message: error.response.data});
             
            } else if (error.request) {
                // The request was made but no response was received
                error_log=error.request;
                res.status(400).json({message:error.request});
             
            } else {
                // Something happened in setting up the request that triggered an Error
                error_log=error.message;
                res.status(400).json({message:error.message});
            }

        
        });
    }else{

        const errors = [];
        if (!isPhoneValid) errors.push("Invalid phone number.");
        if (!isBusinessPhoneIdValid) errors.push("Invalid business_phone_id.");
        if (!iscountryCode) errors.push("Invalid Country Code is not exist");
        
        
        res.status(400).json({ valid: false, errors });
    }   
    
}



const sendIntractive = (req, res) => {
    
    axios.post('https://graph.facebook.com/v18.0/238279596042455/messages', {
        messaging_product: 'whatsapp',
        to: '918826619980',
        type: 'template',
        template: {
            name: 'custom_food_order_template',
            language: {
                code: 'en'
            }
        }
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        res.status(response.status).json({message: response.data});
           
    
    })
    .catch(error => {
   
        res.status(response.status).json({message: response.data});
    });
    

}



const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable with multer configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // limit file size to 1MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    console.log(file.originalname);
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


const uploadImage =(req,res) =>{
  console.log("rrrrrrrr");
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log('Uploads directory created.');
    } else {
        console.log('Uploads directory exists.');
    }
    console.log("rrrrrrrr1");



    console.log("Ranjan kUMAR............");

    upload(req, res, (err) => {
        if (err) {
            res.send({ message: err });
        } else {
            if (req.file == undefined) {
                res.send({ message: 'No file selected!' });
            } else {
                   

            
                    const imageData={name:req.file.filename}
                    const image = new imageUpload(imageData);
                     image.save();
                  
               

                res.send({ message: 'File uploaded successfully!', file: `uploads/${req.file.filename}` });
            }
        }
    });
}
const getAllImages= async (req,res) => {
    try {


        const images = await imageUpload.find({});
      
      
        const imageBaseUrl = `${req.protocol}://${req.get('host')}/uploads`;
        const imagesWithPaths = images.map(image => ({
            ...image.toObject(),
            name: `${imageBaseUrl}/${image.name}`
        }));
         console.log(imagesWithPaths);
        res.status(200).json({ images: imagesWithPaths });
    
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
};

const getTemplateDetail = (req,res) => {


    const {business_id,tempalteName}=req.body;
    if(business_id && tempalteName ){

            const url = `${apiUrl}/${business_id}/message_templates`;
            
            axios.get(url, {
                params: {
                    access_token: accessToken
                }
            })
            .then(function (response) {

                const templates = response.data.data;
                const template = templates.find(template => template.name ===tempalteName);
                
                if (template) {
                    console.log("Template found:", template);
                    res.status(response.status).json({message:template});
                } else {

                    res.status(response.status).json({message:"Template not exist"});
                 
                }
              
            
            })
            .catch(function (error) {
            
                if (error.response) {
                    // Extract error message and status code from the response
                    const errorMessage = error.response.data.error.message;
                    const errorCode = error.response.status;
            
                    // Send the error message and status code in the response
                    res.status(errorCode).json({ error: errorMessage });
                } else {
                    // If the error does not have a response object, send a generic error message
                    res.status(500).json({ error: 'An unexpected error occurred.' });
                }
            });
    }else{
        const errors = [];
        if (!business_id) errors.push("Business id should not be empty.");
        if (!tempalteName) errors.push("Template name should not be blank");
        

        res.status(500).json({ error: errors });
        

    } 



}
const getTemplates = (req, res) => {

  
    if(sender_user_id){
     
            const url = `${apiUrl}/${sender_user_id}/message_templates`;
      
            axios.get(url, {
                params: {
                    access_token: accessToken
                }
            })
            .then(function (response) {
              
                
                res.status(response.status).json({message: response.data});
            
            })
            .catch(function (error) {
          
                if (error.response) {
                    // Extract error message and status code from the response
                    const errorMessage = error.response.data.error.message;
                    const errorCode = error.response.status;
                 
                    // Send the error message and status code in the response
                    res.status(errorCode).json({ error: errorMessage });
                } else {
                    // If the error does not have a response object, send a generic error message
                    res.status(500).json({ error: 'An unexpected error occurred.' });
                }
            });
    }else{
        const errors = [];
        if (!business_id) errors.push("Business id should not be empty.");

    }    

}


const sendMessageTemplate = (req, res) => {




    
           
            const { phone,templateName,language_code,header,body,footer} = req.body;
            isPhoneValid = helper.validatePhone(phone);
            const components = [];
            let myHeader=[];
            if (header.length != 0) {

               
              
                const headerComponent = {
                    type: "header",
                    parameters:header
                };
                components.push(headerComponent);
            }
        

            if (body) {

            
                // Add the body component (assuming it's always included)
                const bodyComponent = {
                    type: "body",
                    parameters:body
                };
                components.push(bodyComponent);

            }
        
        if (footer) {

            const myFooter=[];
            myFooter.push(footer);
            const footerComponent = {
                type: "footer",
                parameters: myFooter
            };
           // components.push(footerComponent);
        }



            const payload= {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": country_code+phone,
                "type": "template",
                "template": {
                    "name": templateName,
                    "language": {
                        "code": language_code
                    },
                    "components":components
                }
            };

            console.log(JSON.stringify(payload),"rajes");

        if (isPhoneValid && templateName && language_code ) {

            const url = `${apiUrl}/${sender_business_id}/messages`;
                   console.log(url);
                        axios.post(url, payload, {
                            params: {
                                access_token: accessToken
                            }
                        })
                        .then(response => {

                            res.status(200).json(response.data);
                    
                        })
                        .catch(error => {
                        

                            if (error.response) {
                                // Extract error message and status code from the response
                                const errorMessage = error.response.data.error.message;
                                const errorCode = error.response.status;
                        
                                // Send the error message and status code in the response
                                res.status(errorCode).json({ error: errorMessage });
                            } else {
                                // If the error does not have a response object, send a generic error message
                                res.status(500).json({ error: 'An unexpected error occurred.' });
                            }
                    
                        });

        }else{

            const errors = [];
            if (!isPhoneValid) errors.push("Invalid phone number.");
            if (!language_code) errors.push("Please enter language  code.");
            if (!templateName) errors.push("Please Enter template Name");
        
         
            
            res.status(400).json({ valid: false, errors });

        }        


}


const createTemplates = (req, res) => {
  
        
        // Define your Facebook Graph API endpoint and access token
        const API_ENDPOINT = apiUrl;
        const ACCESS_TOKEN = accessToken;
        const { templateName,language_code,category,components} = req.body;
        console.log("Language code",language_code);
        // Define the parameters for the new message template
        const data1 = {
                        name:templateName,
                        language_code: language_code,
                        category: category,
                        components:JSON.stringify(components)
                        };
                 
          
    if(templateName && language_code && category && components && sender_user_id){

        const axios = require('axios');

        console.log(JSON.stringify(components));

        const url = 'https://graph.facebook.com/v19.0/285866154612098/message_templates';
        const params = {
          name: templateName,
          language:language_code,
          category: category,
          components: JSON.stringify(components),
          access_token:accessToken
        };
        
        axios.post(url, null, { params })
          .then(response => {
            res.status(200).json(response.data);
                    
         
          })
          .catch(error => {
            console.error('Error:', error.response.data);
            res.status(400).json( error.response.data);
          });
        
    }else{

        const errors = [];
        if (!templateName) errors.push("Please Enter Templatename.");
        if (!language_code) errors.push("Please Enter Langugagecode.");
        if (!category) errors.push("Please Enter Category.");
        if (!components) errors.push("Component format should not be empty");
        
        
        res.status(400).json({ valid: false, errors });
    }    


}

    async function readMessage(req, res) {


            const { phone} = req.body;
            const items = await messageModel.getAllMessage();
              res.status(200).json(items);
 
   
    
}

module.exports = {
    sendMessage,
    sendIntractive,
    sendAttachment,
    sendLocation,
    sendContact,
    getTemplates,
    createTemplates,
    readMessage,
    sendMessageTemplate,
    sendPDF,
    getTemplateDetail,
    uploadImage,
    getAllImages

    

}