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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArticle = createArticle;
exports.getArticlesList = getArticlesList;
exports.getArticleInfo = getArticleInfo;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function createArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        // article 저장하기
        const { title, content } = req.body;
        const articleCreate = yield prismaclient_1.default.article.create({
            data: {
                title,
                content,
                userId,
            },
        });
        res.status(201).json(articleCreate);
    });
}
function getArticlesList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { offset, limit, title, content, orderBy } = req.validated;
        const articles = yield prismaclient_1.default.article.findMany({
            where: {
                title: {
                    contains: title,
                },
                content: {
                    contains: content,
                },
            },
            skip: offset,
            take: limit,
            orderBy,
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });
        if (!articles)
            return res.status(401).json({ message: '게시글 목록을 찾을 수 없습니다' });
        res.status(200).json(articles);
    });
}
function getArticleInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const articleId = req.article.id;
        const article = yield prismaclient_1.default.article.findUniqueOrThrow({
            where: { id: articleId },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });
        // 현재 User가 좋아요 했는지 확인하기
        const userId = req.user.id;
        const checkLiked = yield prismaclient_1.default.articleLikes.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId,
                },
            },
        });
        let isLiked = false;
        if (checkLiked) {
            isLiked = true;
        }
        res.status(200).json({ article, isLiked });
    });
}
function updateArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const articleId = req.article.id;
        const articleUpdate = yield prismaclient_1.default.article.update({
            where: { id: articleId },
            data: req.body,
        });
        res.status(200).json(articleUpdate);
    });
}
function deleteArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const articleId = req.article.id;
        yield prismaclient_1.default.article.delete({
            where: { id: articleId },
        });
        res.status(204).json({ message: '삭제 완료' });
    });
}
