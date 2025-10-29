import multer from "multer";

// Memory storage (server RAM)
const storage = multer.memoryStorage();

// File filter (optional) — শুধু ইমেজ ফাইল অনুমোদিত
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // accept
  } else {
    cb(new Error("Only image files are allowed"), false); // reject
  }
};

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

// Middleware function — single file
export const uploadSingleImage = (fieldName) => upload.single(fieldName);

// Middleware function — multiple files
export const uploadMultipleImages = (fieldName, maxCount = 5) =>
  upload.array(fieldName, maxCount);
