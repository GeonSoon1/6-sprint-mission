import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { CommentController } from "../controllers/comment.controller";
import {
  authenticate,
  optionalAuthenticate,
} from "../middlewares/auth.middleware";
import {
  validateProductCreate,
  validateProductUpdate,
  validateCommentCreate,
} from "../middlewares/validation.middleware";

const router = Router();
const productController = new ProductController();
const commentController = new CommentController();

router
  .route("/")
  .get(productController.getProducts)
  .post(authenticate, validateProductCreate, productController.createProduct);

router
  .route("/:id")
  .get(optionalAuthenticate, productController.getProduct)
  .patch(authenticate, validateProductUpdate, productController.updateProduct)
  .delete(authenticate, productController.deleteProduct);

router.post("/:id/like", authenticate, productController.toggleLike);

// Product Comments
router
  .route("/:productId/comments")
  .get(commentController.getProductComments)
  .post(
    authenticate,
    validateCommentCreate,
    commentController.createProductComment
  );

router
  .route("/comments/:id")
  .patch(
    authenticate,
    validateCommentCreate,
    commentController.updateProductComment
  )
  .delete(authenticate, commentController.deleteProductComment);

export default router;
