require('dotenv').config()

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// perhaps create a configFile for this


cloudinary.config({ 
cloud_name: process.env.CLOUD_NAME, 
api_key: process.env.CLOUDINARY_API_KEY , 
api_secret: process.env.CLOUDINARY_API_SECRET ,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'DEV',
    }
})

const upload = multer({storage: storage});

module.exports = { upload };