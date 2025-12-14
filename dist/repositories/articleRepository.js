"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findArticlesWithLikes = findArticlesWithLikes;
exports.findArticleByIdWithLikes = findArticleByIdWithLikes;
exports.findArticleById = findArticleById;
exports.createArticle = createArticle;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
exports.findMyArticles = findMyArticles;
exports.findArticleLike = findArticleLike;
exports.deleteArticleLike = deleteArticleLike;
exports.createArticleLike = createArticleLike;
exports.countArticleLikes = countArticleLikes;
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
function findArticlesWithLikes() {
    return prismaClient_1.default.article.findMany({
        include: { likes: true },
        orderBy: { createdAt: 'desc' },
    });
}
function findArticleByIdWithLikes(id) {
    return prismaClient_1.default.article.findUnique({
        where: { id },
        include: { likes: true },
    });
}
function findArticleById(id) {
    return prismaClient_1.default.article.findUnique({
        where: { id },
    });
}
function createArticle(data) {
    return prismaClient_1.default.article.create({ data });
}
function updateArticle(id, data) {
    return prismaClient_1.default.article.update({
        where: { id },
        data,
    });
}
function deleteArticle(id) {
    return prismaClient_1.default.article.delete({
        where: { id },
    });
}
function findMyArticles(userId) {
    return prismaClient_1.default.article.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
function findArticleLike(userId, articleId) {
    return prismaClient_1.default.articleLike.findFirst({
        where: { userId, articleId },
    });
}
function deleteArticleLike(likeId) {
    return prismaClient_1.default.articleLike.delete({
        where: { id: likeId },
    });
}
function createArticleLike(userId, articleId) {
    return prismaClient_1.default.articleLike.create({
        data: { userId, articleId },
    });
}
function countArticleLikes(articleId) {
    return prismaClient_1.default.articleLike.count({
        where: { articleId },
    });
}
