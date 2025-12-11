"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("../lib/asyncHandler"));
const p = __importStar(require("../controllers/product-controller"));
const pc = __importStar(require("../controllers/productComment-controller"));
const pl = __importStar(require("../controllers/productLike-controller"));
const product_validation_1 = require("../validators/product-validation");
const comment_validation_1 = require("../validators/comment-validation");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const productRoute = express_1.default.Router();
// ======= ======= ======= ======= =======
// =======  product 자체 API 명령어  =======
// ======= ======= ======= ======= =======
productRoute.post('/', authenticate_1.default, product_validation_1.productCreateValidation, (0, asyncHandler_1.default)(p.createProduct));
productRoute.get('/', product_validation_1.productListValidation, (0, asyncHandler_1.default)(p.getProductsList));
productRoute.get('/:id', authenticate_1.default, product_validation_1.productInfoValidation, (0, asyncHandler_1.default)(p.getProductInfo));
productRoute.patch('/:id', authenticate_1.default, product_validation_1.productUpdateValidation, product_validation_1.productUserCheckValidation, (0, asyncHandler_1.default)(p.updateProduct));
productRoute.delete('/:id', authenticate_1.default, product_validation_1.productUserCheckValidation, (0, asyncHandler_1.default)(p.deleteProduct));
// ======= ======= ======= ======= =======
// ======= product에 연결 된 comment =======
// ======= ======= ======= ======= =======
productRoute.post('/:productId/comments', authenticate_1.default, comment_validation_1.commentCreateValidation, (0, asyncHandler_1.default)(pc.createProductComment));
productRoute.get('/:productId/comments', (0, asyncHandler_1.default)(pc.getProductCommentList));
productRoute.patch('/:productId/comments/:commentId', authenticate_1.default, comment_validation_1.commentUpdateValidation, (0, asyncHandler_1.default)(pc.updateProductComment));
productRoute.delete('/:productId/comments/:commentId', authenticate_1.default, (0, asyncHandler_1.default)(pc.deleteProductComment));
// ======= ======= ======= ======= =======
// ====== product에 연결 된 likeCount ======
// ======= ======= ======= ======= =======
productRoute.post('/:id/likeCount', authenticate_1.default, (0, asyncHandler_1.default)(pl.likeCountUp));
productRoute.delete('/:id/likeCount', authenticate_1.default, (0, asyncHandler_1.default)(pl.likeCountDown));
exports.default = productRoute;
