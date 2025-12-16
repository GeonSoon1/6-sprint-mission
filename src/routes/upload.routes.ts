import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { upload } from "../middlewares/upload.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const uploadController = new UploadController();

router.post(
  "/image",
  authenticate,
  upload.single("image"),
  uploadController.uploadImage
);

export default router;
