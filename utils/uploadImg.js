const multer = require("multer");
const cloudinary = require("cloudinary");
const {BadReqErr}=require('../errorclasses/badReq')
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
const uploadVideosToCloudinary = async (base64) => {
  try {
    const { uploader } = cloudinary;

    const res = await uploader.upload_large(
      base64
      ,
      { resource_type: 'video' }
    )
    console.log(res)
    return res;
  } catch (error) {
    throw new BadReqErr(error.message);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadVideosToCloudinary
};