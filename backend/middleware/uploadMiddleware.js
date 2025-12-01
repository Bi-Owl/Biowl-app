const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    // Sanitize originalname to prevent path traversal issues and ensure unique names
    const safeOriginalName = path.basename(file.originalname).replace(/[^a-zA-Z0-9-_\.]/g, '');
    cb(null, file.fieldname + '-' + Date.now() + path.extname(safeOriginalName));
  }
});

// Check file type for images
function checkImageType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('خطا: فقط فایل‌های تصویری (jpeg, jpg, png, gif, webp) مجاز هستند!'));
  }
}

// Check file type for PDFs
function checkPdfType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('خطا: فقط فایل‌های PDF مجاز هستند!'));
    }
}

// Middleware for uploading a single question image from a field named 'image'
exports.uploadQuestionImage = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        checkImageType(file, cb);
    }
}).single('image');

// Middleware for uploading a single PDF answer key from a field named 'answerKeyPdf'
exports.uploadAnswerKeyPdf = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function(req, file, cb) {
        checkPdfType(file, cb);
    }
}).single('answerKeyPdf');