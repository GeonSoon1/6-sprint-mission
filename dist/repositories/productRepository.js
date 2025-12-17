"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProductsWithLikes = findProductsWithLikes;
exports.findProductByIdWithLikes = findProductByIdWithLikes;
exports.findProductById = findProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.findMyProducts = findMyProducts;
exports.findProductLike = findProductLike;
exports.deleteProductLike = deleteProductLike;
exports.createProductLike = createProductLike;
exports.countProductLikes = countProductLikes;
exports.findLikedProducts = findLikedProducts;
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
function findProductsWithLikes() {
    return prismaClient_1.default.product.findMany({
        include: { likes: true },
        orderBy: { createdAt: 'desc' },
    });
}
function findProductByIdWithLikes(id) {
    return prismaClient_1.default.product.findUnique({
        where: { id },
        include: { likes: true },
    });
}
function findProductById(id) {
    return prismaClient_1.default.product.findUnique({
        where: { id },
    });
}
function createProduct(data) {
    return prismaClient_1.default.product.create({ data });
}
function updateProduct(id, data) {
    return prismaClient_1.default.product.update({
        where: { id },
        data,
    });
}
function deleteProduct(id) {
    return prismaClient_1.default.product.delete({
        where: { id },
    });
}
function findMyProducts(userId) {
    return prismaClient_1.default.product.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
function findProductLike(userId, productId) {
    return prismaClient_1.default.productLike.findFirst({
        where: { userId, productId },
    });
}
function deleteProductLike(likeId) {
    return prismaClient_1.default.productLike.delete({
        where: { id: likeId },
    });
}
function createProductLike(userId, productId) {
    return prismaClient_1.default.productLike.create({
        data: { userId, productId },
    });
}
function countProductLikes(productId) {
    return prismaClient_1.default.productLike.count({
        where: { productId },
    });
}
function findLikedProducts(userId) {
    return prismaClient_1.default.productLike.findMany({
        where: { userId },
        include: { product: true },
        orderBy: { createdAt: 'desc' },
    });
}
