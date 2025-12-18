import express from 'express';
import asyncHandler from '../lib/asyncHandler';
import * as p from '../controllers/product-controller';
import * as pc from '../controllers/productComment-controller';
import * as pl from '../controllers/productLike-controller';

import {
  userDataValidation,
  productDataValidation,
  productCommentDataValidation,
} from '../validators/common-dbcheck-validation';

import {
  productUserCheckValidation,
  proCommentUserCheckValidation,
} from '../validators/common-permission-validation';

import { getQueryValidation } from '../validators/common-query-validation';

import {
  productCreateValidation,
  productUpdateValidation,
} from '../validators/product-validation';

import {
  commentCreateValidation,
  commentUpdateValidation,
} from '../validators/productComment-validation';

import {
  productLikeUpValidation,
  productLikeDownValidation,
} from '../validators/userLike-validation';

import authenticate from '../middleware/authenticate';

const productRoute = express.Router();

// ======= ======= ======= ======= =======
// =======  product 자체 API 명령어  =======
// ======= ======= ======= ======= =======

productRoute.post(
  '/',
  authenticate,
  userDataValidation,
  productCreateValidation,
  asyncHandler(p.createProduct)
);
productRoute.get('/', getQueryValidation, asyncHandler(p.getProductsList));

productRoute.get(
  '/:id',
  authenticate,
  userDataValidation,
  productDataValidation,
  asyncHandler(p.getProductInfo)
);

productRoute.patch(
  '/:id',
  authenticate,
  productUpdateValidation,
  userDataValidation,
  productDataValidation,
  productUserCheckValidation,
  asyncHandler(p.updateProduct)
);

productRoute.delete(
  '/:id',
  authenticate,
  userDataValidation,
  productDataValidation,
  productUserCheckValidation,
  asyncHandler(p.deleteProduct)
);

// ======= ======= ======= ======= =======
// ======= product에 연결 된 comment =======
// ======= ======= ======= ======= =======

productRoute.post(
  '/:productId/comments',
  authenticate,
  userDataValidation,
  productDataValidation,
  commentCreateValidation,
  asyncHandler(pc.createProductComment)
);

productRoute.get(
  '/:productId/comments',
  productDataValidation,
  asyncHandler(pc.getProductCommentList)
);

productRoute.patch(
  '/:productId/comments/:commentId',
  authenticate,
  commentUpdateValidation,
  userDataValidation,
  productDataValidation,
  productCommentDataValidation,
  proCommentUserCheckValidation,
  asyncHandler(pc.updateProductComment)
);

productRoute.delete(
  '/:productId/comments/:commentId',
  authenticate,
  userDataValidation,
  productDataValidation,
  productCommentDataValidation,
  proCommentUserCheckValidation,
  asyncHandler(pc.deleteProductComment)
);

// ======= ======= ======= ======= =======
// ====== product에 연결 된 likeCount ======
// ======= ======= ======= ======= =======

productRoute.post(
  '/:id/likeCount',
  authenticate,
  userDataValidation,
  productDataValidation,
  productLikeUpValidation,
  asyncHandler(pl.likeCountUp)
);
productRoute.delete(
  '/:id/likeCount',
  authenticate,
  userDataValidation,
  productDataValidation,
  productLikeDownValidation,
  asyncHandler(pl.likeCountDown)
);

export default productRoute;
