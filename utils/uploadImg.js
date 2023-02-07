const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const {BadReqErr}=require('../errorclasses/badReq')
const fs=require('fs')
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
});

const uploadToCloudinary = async (fileString, format) => {
  try {
    const { uploader } = cloudinary;

    const res = await uploader.upload(
      `data:image/${format};base64,${fileString}`
    );

    return res;
  } catch (error) {
    throw new BadReqErr(error.msg);
  }
};
const uploadVideosToCloudinary = async (buffer, mimetype) => {
  try {
    
     const tempFilePath = `/tmp/${Date.now()}.${mimetype.split('/')[1]}`;
     fs.writeFileSync(tempFilePath, buffer);

     const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: 'video',
      public_id: `${Date.now()}`,
      format: mimetype.split('/')[1],
    });

    fs.unlinkSync(tempFilePath);
    return result;
  } catch (error) {
    throw new BadReqErr(error.message);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadVideosToCloudinary
};