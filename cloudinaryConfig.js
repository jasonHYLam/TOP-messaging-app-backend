require('dotenv').config()
const path = require('path');

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

function fileFilter (req, file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) return cb(null, true)
  cb(`Error: File upload only supports the following filetypes - ${filetypes}`)
}

const upload = multer({storage: storage, fileFilter});
// const upload = multer();

module.exports = { upload};