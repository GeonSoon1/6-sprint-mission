"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getMyProducts = getMyProducts;
exports.toggleProductLike = toggleProductLike;
exports.getLikedProducts = getLikedProducts;
const productService_1 = require("../services/productService");
function getProducts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cookies = req.cookies;
            const data = yield (0, productService_1.getProductsService)(cookies);
            return res.status(200).json(data);
        }
        catch (e) {
            next(e);
        }
    });
}
function getProductById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cookies = req.cookies;
            const data = yield (0, productService_1.getProductByIdService)(req.params.id, cookies);
            return res.status(200).json(data);
        }
        catch (e) {
            next(e);
        }
    });
}
function createProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id; // authenticate에서 세팅됨
            const body = req.body;
            const product = yield (0, productService_1.createProductService)(body, userId);
            return res.status(201).json(product);
        }
        catch (e) {
            next(e);
        }
    });
}
function updateProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const body = req.body;
            const updated = yield (0, productService_1.updateProductService)(req.params.id, body, userId);
            return res.status(200).json(updated);
        }
        catch (e) {
            next(e);
        }
    });
}
function deleteProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            yield (0, productService_1.deleteProductService)(req.params.id, userId);
            return res.status(204).send();
        }
        catch (e) {
            next(e);
        }
    });
}
function getMyProducts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const products = yield (0, productService_1.getMyProductsService)(userId);
            return res.status(200).json(products);
        }
        catch (e) {
            next(e);
        }
    });
}
function toggleProductLike(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const result = yield (0, productService_1.toggleProductLikeService)(req.params.id, userId);
            return res.status(200).json(result);
        }
        catch (e) {
            next(e);
        }
    });
}
function getLikedProducts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const products = yield (0, productService_1.getLikedProductsService)(userId);
            return res.status(200).json(products);
        }
        catch (e) {
            next(e);
        }
    });
}
