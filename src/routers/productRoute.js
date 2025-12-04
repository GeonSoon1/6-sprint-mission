import express from 'express';
import asyncHandler from '../lib/asyncHandler.js';
import * as p from '../controllers/product-controllers.js';
import * as pc from '../controllers/productComment-controllers.js';
import * as pl from '../controllers/productLike-controllers.js';

import {
  productCreateValidation,
  productUpdateValidation,
} from '../validators/product-validation.js';

import {
  commentCreateValidation,
  commentUpdateValidation,
} from '../validators/comment-validation.js';

import authenticate from '../../middleware/authenticate.js';

const productRoute = express.Router();

// ======= ======= ======= ======= =======
// =======  product 자체 API 명령어  =======
// ======= ======= ======= ======= =======

productRoute.post(
  '/',
  authenticate,
  productCreateValidation,
  asyncHandler(p.createProduct)
);
productRoute.get('/', asyncHandler(p.getProductsList));

productRoute.get('/:id', authenticate, asyncHandler(p.getProductInfo));

productRoute.patch(
  '/:id',
  authenticate,
  productUpdateValidation,
  asyncHandler(p.updateProduct)
);

productRoute.delete('/:id', authenticate, asyncHandler(p.deleteProduct));

// ======= ======= ======= ======= =======
// ======= product에 연결 된 comment =======
// ======= ======= ======= ======= =======

productRoute.post(
  '/:productId/comments',
  authenticate,
  commentCreateValidation,
  asyncHandler(pc.createProductComment)
);

productRoute.get(
  '/:productId/comments',
  asyncHandler(pc.getProductCommentList)
);

productRoute.patch(
  '/:productId/comments/:commentId',
  authenticate,
  commentUpdateValidation,
  asyncHandler(pc.updateProductComment)
);

productRoute.delete(
  '/:productId/comments/:commentId',
  authenticate,
  asyncHandler(pc.deleteProductComment)
);

// ======= ======= ======= ======= =======
// ====== product에 연결 된 likeCount ======
// ======= ======= ======= ======= =======

productRoute.post('/:id/likeCount', authenticate, asyncHandler(pl.likeCountUp));
productRoute.delete(
  '/:id/likeCount',
  authenticate,
  asyncHandler(pl.likeCountDown)
);

export default productRoute;
