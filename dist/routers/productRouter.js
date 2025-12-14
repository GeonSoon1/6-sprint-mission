"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middleware/asyncHandler");
const productController_1 = require("../controllers/productController");
const validation_1 = require("../middleware/validation");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const router = express_1.default.Router();
router
    .route('/')
    .get((0, asyncHandler_1.asyncHandler)(productController_1.getProducts))
    .post(authenticate_1.default, validation_1.validateProduct, (0, asyncHandler_1.asyncHandler)(productController_1.createProduct));
// 내가 등록한 상품
router.get('/me', authenticate_1.default, (0, asyncHandler_1.asyncHandler)(productController_1.getMyProducts));
// 내가 좋아요한 상품 목록
router.get('/likes', authenticate_1.default, (0, asyncHandler_1.asyncHandler)(productController_1.getLikedProducts));
// 좋아요
router.post('/:id/like', authenticate_1.default, (0, asyncHandler_1.asyncHandler)(productController_1.toggleProductLike));
router
    .route('/:id')
    .get((0, asyncHandler_1.asyncHandler)(productController_1.getProductById))
    .patch(authenticate_1.default, (0, asyncHandler_1.asyncHandler)(productController_1.updateProduct))
    .delete(authenticate_1.default, (0, asyncHandler_1.asyncHandler)(productController_1.deleteProduct));
exports.default = router;
