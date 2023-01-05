const express = require('express');
const router = express.Router();
//provides the middleware for handling multipart/form-data used for uploading files
const multer = require('multer');
const AWS = require('aws-sdk');
const paramsConfig = require('../utils/param-configs');

// create a temporary storage container that will hold the image files until it is ready to be uploaded to the S3 bucket
const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});

// We'll use the upload function to store the image data from the form data received by the POST route. We'll use the single method to define that this upload function will receive only one image. We'll also define the key of the image object as image.
const upload = multer({ storage }).single('image');

// intiating s3 service object
const s3 = new AWS.S3({
    // lock in the version number because default might change
    apiVersion: '2006-03-01',
});

// creates the image upload route
// POST /api/image-upload
// upload defines the key and storage destination 
router.post('/image-upload', upload, (req, res) => {
    console.log("post('/api/image-upload'", req.file);
    const params = paramsConfig(req.file);
    s3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        res.json(data);
    });
  });

module.exports = router;