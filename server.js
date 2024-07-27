const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3005;
const webhook= require('./controllers/webhookController');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const webhookToken ='raz@1235';
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/webhooks', (req, res) => {
    console.log(req);
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] =='raz@1235'
    ) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
});

app.post('/webhooks',webhook.sentWebhook);
app.use('/api/whatsapp', require('./routes/whatsApp')); 
app.use('/api/auth', require('./routes/authRoute'));


app.listen(port, () => {
    console.log(`Server runing on port ${port}`);
});



// Sta


