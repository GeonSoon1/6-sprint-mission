import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { optionalAuthenticate } from "../middlewares/optionalAuthenticate.js";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  createProductComment,
  getMyProduct,
} from "../controllers/product.controller.js";
import {
  likeProduct,
  unlikeProduct,
  getMyLikedProducts,
} from "../controllers/like.controller.js";

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

// 생성/수정/삭제는 로그인 필요
productRouter.post(
  "/",
  asyncHandler(authenticate),
  asyncHandler(createProduct)
);
// productRouter.get(
//   "/:id(\\d+)",
//   asyncHandler(authenticate),
//   asyncHandler(getProduct)
// );
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

// 단건 조회는 비로그인도 가능 (토큰이 있으면 isLiked 계산)
productRouter.get(
  "/:id(\\d+)",
  asyncHandler(optionalAuthenticate),
  asyncHandler(getProduct)
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
