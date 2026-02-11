"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRepogitory = void 0;
const prismaClient_1 = __importDefault(require("../../libs/prismaClient"));
class ArticleRepogitory {
    // 게시글 생성
    async create(data) {
        return prismaClient_1.default.article.create({ data });
    }
    //게시글 목록 조회
    async findMany(params) {
        return prismaClient_1.default.article.findMany({
            ...params,
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                articleLikeCount: true,
            },
        });
    }
    // 게시글 목록 조회 유저 좋아요 여부
    async findUserLikedArticles(userId) {
        const user = await prismaClient_1.default.user.findUnique({
            where: { id: userId },
            include: { likedArticles: true },
        });
        if (!user)
            return [];
        return user.likedArticles.map((a) => a.articleId);
    }
    // 게시글 상세 조회
    async findById(id) {
        return prismaClient_1.default.article.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                articleLikeCount: true,
            },
        });
    }
    // 게시글 상세 조회 유저 좋아요 여부
    async checkUserLiked(userId, articleId) {
        return prismaClient_1.default.likedArticle.findUnique({
            where: { userId_articleId: { userId, articleId } },
        });
    }
    // 게시글 수정
    async update(id, data) {
        return prismaClient_1.default.article.update({ where: { id }, data });
    }
    // 게시글 삭제
    async delete(id) {
        return prismaClient_1.default.article.delete({ where: { id } });
    }
    // 유저가 생성한 게시글 목록 조회
    async findByUserId(userId) {
        return prismaClient_1.default.article.findMany({ where: { userId } });
    }
    // 게시글 작성자 ID 조회
    async findUserId(id) {
        const article = await prismaClient_1.default.article.findUnique({
            where: { id },
            select: { userId: true },
        });
        return article?.userId;
    }
}
exports.ArticleRepogitory = ArticleRepogitory;
//# sourceMappingURL=article.repository.js.map