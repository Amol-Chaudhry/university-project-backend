// Cloudinary used for media management and storage
// reference: https://cloudinary.com/documentation

//This utility configures cloudinary.
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };