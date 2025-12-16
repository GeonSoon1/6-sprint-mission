"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleRepository = void 0;
const prismaClient_1 = require("../lib/prismaClient");
exports.articleRepository = {
    create(data) {
        return prismaClient_1.prismaClient.article.create({ data });
    },
    findById(id) {
        return prismaClient_1.prismaClient.article.findUnique({ where: { id } });
    },
    update(id, data) {
        return prismaClient_1.prismaClient.article.update({ where: { id }, data });
    },
    delete(id) {
        return prismaClient_1.prismaClient.article.delete({ where: { id } });
    },
    findList({ skip, take, orderBy, where }) {
        return prismaClient_1.prismaClient.article.findMany({
            skip,
            take,
            orderBy,
            where,
        });
    },
    count(where) {
        return prismaClient_1.prismaClient.article.count({ where });
    },
    isLiked(userId, articleId) {
        return prismaClient_1.prismaClient.likeArticle.findFirst({
            where: { userId: userId, articleId: articleId },
        });
    },
};
