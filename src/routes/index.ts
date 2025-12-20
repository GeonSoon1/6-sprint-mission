import { Router } from "express";
import userRoutes from "./user.routes";
import productRoutes from "./product.routes";
import articleRoutes from "./article.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/articles", articleRoutes);
router.use("/upload", uploadRoutes);

export default router;
