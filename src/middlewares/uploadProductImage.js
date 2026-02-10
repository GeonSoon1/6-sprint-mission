// middlewares/uploadProductImage.js
import multer from "multer";
import { uploadImageToS3 } from "../lib/s3.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter(_req, file, cb) {
    if (!file.mimetype?.startsWith("image/")) {
      cb(new Error("이미지 파일만 업로드할 수 있어요."));
      return;
    }
    cb(null, true);
  },
});

export const uploadProductImage = upload.single("image");

export async function attachProductImageUrl(req, _res, next) {
  try {
    if (!req.file) return next();

    const { url } = await uploadImageToS3({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      contentType: req.file.mimetype,
      folder: "products",
    });

    req.body.imageUrl = url;
    return next();
  } catch (e) {
    return next(e);
  }
}
