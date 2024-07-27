const express = require('express');
const checkPermission = require('../middleware/checkPermission');
const app = express();

const router = express.Router();
const {
    sendMessage,
    sendAttachment,
    sendIntractive,
    sendLocation,
    sendContact,
    getTemplates,
    createTemplates,
    sendTemplates,
    getTemplateDetail,
    readMessage,
    sendPDF,
    sendMessageTemplate,
    uploadImage,
    getAllImages

} = require('../controllers/whatsappController');

router.route('/sendMessage').post(checkPermission('send_message'), sendMessage);
router.route('/sendLocation').post(checkPermission('send_location'), sendLocation);
router.route('/sendMessageTemplate').post(sendMessageTemplate);
router.route('/sendLocation').post(checkPermission('send_attachment'), sendLocation);
router.route('/sendIntractive').post(checkPermission('send_intractive'), sendIntractive);
router.route('/sendAttachment').post(checkPermission('send_attachment'), sendAttachment);
router.route('/sendContact').post(checkPermission('send_contact'), sendContact);
//router.route('/getTemplates').post(checkPermission('get_templates'), getTemplates);
router.route('/createTemplates').post(checkPermission('create_templates'), createTemplates);
router.route('/sendPDF').post(checkPermission('send_pdf'), sendPDF);
router.route('/readMessage').post(checkPermission('read_message'), readMessage);
router.route('/sendMessageTemplate').post(checkPermission('sendMessageTemplate'), sendMessageTemplate);
router.route('/sendLocation').get(sendLocation);
router.route('/getTemplates').get(getTemplates);
router.route('/uploadImage').post(checkPermission('send_location'),uploadImage);
router.route('/getAllImages').get(checkPermission('send_location'),getAllImages);

//router.route('/sendMessageTemplate').post(getTemplates);
//router.route('/sendMessage',checkPermission('read_data')).post(sendMessage);
//router.route('/sendLocation').post(sendLocation);
//router.route('/sendAttachment').post(sendAttachment);
//router.route('/sendIntractive').post(sendIntractive);

//router.route('/createTemplates').post(createTemplates);
//router.route('/readMessage').get(readMessage);
//router.route('/sendPDF').post(sendPDF);
//router.route('/sendMessageTemplate').post(sendMessageTemplate);
//router.route('/sendTemplates').post(sendTemplates);
module.exports = router;
