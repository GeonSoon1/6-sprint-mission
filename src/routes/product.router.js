import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  createProductComment,
  getMyProduct,
} from "../controllers/product.control.js";
import {
  likeProduct,
  unlikeProduct,
  getMyLikedProducts,
} from "../controllers/like.control.js";

const productRouter = express.Router();

productRouter.get(
  "/myProduct",
  asyncHandler(authenticate),
  asyncHandler(getMyProduct)
);
productRouter.get(
  "/liked",
  asyncHandler(authenticate),
  asyncHandler(getMyLikedProducts)
);

productRouter.post(
  "/",
  asyncHandler(authenticate),
  asyncHandler(createProduct)
);
productRouter.get(
  "/:id(\\d+)",
  asyncHandler(authenticate),
  asyncHandler(getProduct)
);
productRouter.patch(
  "/:id(\\d+)",
  asyncHandler(authenticate),
  asyncHandler(updateProduct)
);
productRouter.delete(
  "/:id(\\d+)",
  asyncHandler(authenticate),
  asyncHandler(deleteProduct)
);

productRouter.post(
  "/:id(\\d+)/comments",
  asyncHandler(authenticate),
  asyncHandler(createProductComment)
);

productRouter.post(
  "/:id(\\d+)/like",
  asyncHandler(authenticate),
  asyncHandler(likeProduct)
);
productRouter.delete(
  "/:id(\\d+)/like",
  asyncHandler(authenticate),
  asyncHandler(unlikeProduct)
);

export default productRouter;
