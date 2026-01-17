const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dmucpye1q",
  api_key: "536534312483417",
  api_secret: "mOc_EoH0b2vVgiefn76hHQ2B5Go",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "civic-connect-evidence", // Folder name in your cloud
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = { cloudinary, storage };