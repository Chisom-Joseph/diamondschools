const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "photo") {
      cb(null, "public/assets/img/studentPhotos/");
    } else if (file.fieldname === "paymentProof") {
      cb(null, "public/assets/img/paymentProofs/");
    } else {
      cb(new Error("Unexpected file field name"));
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only!"));
  }
}

// module.exports = upload;

module.exports = {
  aspirantUpload: upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "paymentProof", maxCount: 1 },
  ]),
};
