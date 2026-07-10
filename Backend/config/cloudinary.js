const cloudinary = require('cloudinary').v2;

// Reads these three from your .env — add them if they aren't there yet:
//   CLOUDINARY_CLOUD_NAME=xxxxx
//   CLOUDINARY_API_KEY=xxxxx
//   CLOUDINARY_API_SECRET=xxxxx
// (Get these from your Cloudinary dashboard: https://console.cloudinary.com)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;