const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.join(process.cwd(), 'uploads', 'documents');
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${req.params.loanId}-${Date.now()}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new Error('Only PDF, JPG, and PNG files are allowed'));
  }
  return callback(null, true);
};

const uploadDocument = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploadDocument, uploadDirectory };
