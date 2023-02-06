const multer = require("multer");
const cloudinary = require("cloudinary").v2;
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
const uploadVideosToCloudinary = async (data, mimetype,path) => {
  try {
    const stream = data.toString('binary');
    const buffer = Buffer.from(stream, 'binary');
    const result = await cloudinary.uploader.upload_stream({
      resource_type: 'video',
      public_id: `${Date.now()}`,
      buffer,
      format: mimetype.split('/')[1],
    });
    return result;
  } catch (error) {
    throw new BadReqErr(error.message);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadVideosToCloudinary
};