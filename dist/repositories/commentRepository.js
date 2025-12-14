"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProductById = findProductById;
exports.findArticleById = findArticleById;
exports.createProductComment = createProductComment;
exports.createArticleComment = createArticleComment;
exports.findCommentById = findCommentById;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
exports.findProductComments = findProductComments;
exports.findArticleComments = findArticleComments;
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
function findProductById(id) {
    return prismaClient_1.default.product.findUnique({ where: { id } });
}
function findArticleById(id) {
    return prismaClient_1.default.article.findUnique({ where: { id } });
}
function createProductComment(data) {
    return prismaClient_1.default.comment.create({
        data: {
            content: data.content,
            productId: data.productId,
            userId: data.userId,
        },
    });
}
function createArticleComment(data) {
    return prismaClient_1.default.comment.create({
        data: {
            content: data.content,
            articleId: data.articleId,
            userId: data.userId,
        },
    });
}
function findCommentById(id) {
    return prismaClient_1.default.comment.findUnique({ where: { id } });
}
function updateComment(id, content) {
    return prismaClient_1.default.comment.update({
        where: { id },
        data: { content },
    });
}
function deleteComment(id) {
    return prismaClient_1.default.comment.delete({ where: { id } });
}
function findProductComments(params) {
    const { productId, limit, cursor } = params;
    return prismaClient_1.default.comment.findMany({
        where: { productId },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
    });
}
function findArticleComments(params) {
    const { articleId, limit, cursor } = params;
    return prismaClient_1.default.comment.findMany({
        where: { articleId },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
    });
}
