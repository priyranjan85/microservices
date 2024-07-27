const axios = require('axios');
function validatePhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(String(phone));
}

function countryCode(code) {
    const regex = /^\d{2}$/;
    return regex.test(code);
}

// Function to validate message
function validateMessage(message) {
    // Assuming a message should not be empty
    return message.trim().length > 0;
}

// Function to validate business_phone_id
function validateBusinessPhoneId(business_phone_id) {
    // Assuming a business_phone_id should not be empty

    const regex = /^\d+$/;
    return regex.test(business_phone_id);
  
}


async function isPDF(url) {
    try {
        const response = await axios.head(url);
        console.log(response.headers['content-type']);
        return response.headers['content-type'] === 'application/pdf';
    } catch (error) {

        console.log("sssssssss");
        
        return false;
    }
}

async  function validateImageSizeFromURL(imageURL, maxSizeInBytes) {
    try {
        // Fetch the image
        const response = await axios.get(imageURL, {
            responseType: 'arraybuffer'
        });

        // Check if the size of the image is less than or equal to the maximum size
    
        if (response.data.length <= maxSizeInBytes) {
            return true; // Image size is valid
        } else {
            return false; // Image size is too large
        }
    } catch (error) {
        throw new Error('Error loading image');
    }
}
function getFileType(url) {
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
        return 'image';
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
        return 'video';
    } else if (['mp3', 'wav', 'ogg', 'aac', 'wma'].includes(extension)) {
        return 'audio';
    } 
    
    else {
        return 'unknown';
    }
}
module.exports = { validatePhone,
                 validateMessage,
                 validateBusinessPhoneId,
                 countryCode,
                 isPDF,
                 validateImageSizeFromURL,getFileType};