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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsService = getProductsService;
exports.getProductByIdService = getProductByIdService;
exports.createProductService = createProductService;
exports.updateProductService = updateProductService;
exports.deleteProductService = deleteProductService;
exports.getMyProductsService = getMyProductsService;
exports.toggleProductLikeService = toggleProductLikeService;
exports.getLikedProductsService = getLikedProductsService;
const httpError_1 = require("../lib/httpError");
const productRepository_1 = require("../repositories/productRepository");
const token_1 = require("../lib/token");
const constants_1 = require("../lib/constants");
function getOptionalUserId(cookies) {
    try {
        const token = cookies === null || cookies === void 0 ? void 0 : cookies[constants_1.ACCESS_TOKEN_COOKIE_NAME];
        if (!token)
            return null;
        const decoded = (0, token_1.verifyAccessToken)(token);
        return decoded.id || null;
    }
    catch (_a) {
        return null;
    }
}
function mapWithLike(product, userId) {
    const likeCount = product.likes.length;
    const isLiked = userId
        ? product.likes.some((l) => l.userId === userId)
        : false;
    const { likes } = product, rest = __rest(product, ["likes"]);
    return Object.assign(Object.assign({}, rest), { likeCount, isLiked });
}
function getProductsService(cookies) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = getOptionalUserId(cookies);
        const products = (yield (0, productRepository_1.findProductsWithLikes)());
        return products.map((p) => mapWithLike(p, userId));
    });
}
function getProductByIdService(id, cookies) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = getOptionalUserId(cookies);
        const product = (yield (0, productRepository_1.findProductByIdWithLikes)(id));
        if (!product)
            throw new httpError_1.HttpError(404, '상품을 찾을 수 없습니다.');
        return mapWithLike(product, userId);
    });
}
function createProductService(data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, productRepository_1.createProduct)(Object.assign(Object.assign({}, data), { userId }));
    });
}
function updateProductService(id, data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield (0, productRepository_1.findProductById)(id);
        if (!product)
            throw new httpError_1.HttpError(404, '상품을 찾을 수 없습니다.');
        if (product.userId !== userId) {
            throw new httpError_1.HttpError(403, '상품을 수정할 권한이 없습니다.');
        }
        return (0, productRepository_1.updateProduct)(id, data);
    });
}
function deleteProductService(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield (0, productRepository_1.findProductById)(id);
        if (!product)
            throw new httpError_1.HttpError(404, '상품을 찾을 수 없습니다.');
        if (product.userId !== userId) {
            throw new httpError_1.HttpError(403, '상품을 삭제할 권한이 없습니다.');
        }
        yield (0, productRepository_1.deleteProduct)(id);
    });
}
function getMyProductsService(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, productRepository_1.findMyProducts)(userId);
    });
}
function toggleProductLikeService(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield (0, productRepository_1.findProductById)(productId);
        if (!product)
            throw new httpError_1.HttpError(404, '상품을 찾을 수 없습니다.');
        const existing = yield (0, productRepository_1.findProductLike)(userId, productId);
        if (existing)
            yield (0, productRepository_1.deleteProductLike)(existing.id);
        else
            yield (0, productRepository_1.createProductLike)(userId, productId);
        const likeCount = yield (0, productRepository_1.countProductLikes)(productId);
        return { isLiked: !existing, likeCount };
    });
}
function getLikedProductsService(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const likes = yield (0, productRepository_1.findLikedProducts)(userId);
        return likes.map((l) => l.product);
    });
}
