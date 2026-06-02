const path = require('path');
const multer = require('multer');

const carpetaUploads = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, carpetaUploads);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, nombreUnico);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});

module.exports = upload;