const { v4: uuidv4 } = require('uuid');

const params = (fileName) => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];
  
    const imageParams = {
      // Replace the <My_Bucket_Name> with the name of your own S3 bucket
        Bucket: 'user-images-002d79ac-ccef-4228-a1f5-4e779a596376',
        Key: `${uuidv4()}.${fileType}`,
        Body: fileName.buffer,
        ACL: 'public-read', // allows public read access to the file in the S3 bucket
    };
  
    return imageParams;
  };

module.exports = params;

