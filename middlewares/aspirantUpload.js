const multer = require("multer");
const path = require("path");
const os = require("os");
const fs = require("fs");

const studentPhotosDir = os.platform() === "win32"
  ? path.join(__dirname, "../public/assets/img/studentPhotos")
  : "/data/diamondschools_storage/student_photos";

const paymentProofsDir = os.platform() === "win32"
  ? path.join(__dirname, "../public/assets/img/paymentProofs")
  : "/data/diamondschools_storage/payment_proofs";

if (!fs.existsSync(studentPhotosDir)) {
  fs.mkdirSync(studentPhotosDir, { recursive: true });
}
if (!fs.existsSync(paymentProofsDir)) {
  fs.mkdirSync(paymentProofsDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "photo") {
      cb(null, studentPhotosDir);
    } else if (file.fieldname === "paymentProof") {
      cb(null, paymentProofsDir);
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
