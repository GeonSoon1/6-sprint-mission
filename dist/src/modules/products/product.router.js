"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateProduct_1 = require("../../middlewares/validates/validateProduct");
const asyncHandler_1 = require("../../libs/asyncHandler");
const validateId_1 = require("../../middlewares/validates/validateId");
const product_controller_1 = require("./product.controller");
const auth_1 = require("../../middlewares/auth");
const productRouter = express_1.default.Router();
productRouter
    .route('/')
    .post(auth_1.verifyAccessToken, auth_1.authorizeUser, validateProduct_1.validateCreateProduct, (0, asyncHandler_1.asyncHandler)(product_controller_1.productController.create.bind(product_controller_1.productController)))
    .get(validateProduct_1.validateGetListProduct, (0, asyncHandler_1.asyncHandler)(product_controller_1.productController.getProducts.bind(product_controller_1.productController)));
productRouter
    .route('/:id')
    .get(validateId_1.validateIdParam, (0, asyncHandler_1.asyncHandler)(product_controller_1.productController.getById.bind(product_controller_1.productController)))
    .patch(auth_1.verifyAccessToken, auth_1.authorizeUser, validateId_1.validateIdParam, validateProduct_1.validateUpdateProduct, auth_1.authorizeProduct, (0, asyncHandler_1.asyncHandler)(product_controller_1.productController.update.bind(product_controller_1.productController)))
    .delete(auth_1.verifyAccessToken, auth_1.authorizeUser, validateId_1.validateIdParam, auth_1.authorizeProduct, (0, asyncHandler_1.asyncHandler)(product_controller_1.productController.delete.bind(product_controller_1.productController)));
exports.default = productRouter;
//# sourceMappingURL=product.router.js.map