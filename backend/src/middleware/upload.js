const fs = require("fs");
const path = require("path");
const multer = require("multer");

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_SIZE = 10 * 1024 * 1024;
const BACKEND_ROOT = path.resolve(__dirname, "../..");

const safeName = (name) => {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = req.user?._id?.toString() || "unknown";
    const appointmentId = req.params.appointmentId || "unknown";
    const dirPath = path.join(BACKEND_ROOT, "uploads", "reports", userId, appointmentId);
    fs.mkdirSync(dirPath, { recursive: true });
    cb(null, dirPath);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}_${safeName(file.originalname)}`);
  },
});

const uploadReport = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only PDF and image files are allowed."));
  },
});

const galleryStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = req.user?._id?.toString() || "unknown";
    const dirPath = path.join(BACKEND_ROOT, "uploads", "gallery", userId);
    fs.mkdirSync(dirPath, { recursive: true });
    cb(null, dirPath);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}_${safeName(file.originalname)}`);
  },
});

const uploadGallery = multer({
  storage: galleryStorage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
  },
});

module.exports = {
  uploadReport,
  uploadGallery,
};
