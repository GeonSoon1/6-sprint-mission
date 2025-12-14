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
exports.getArticle = getArticle;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
exports.getArticleList = getArticleList;
exports.createComment = createComment;
exports.getCommentList = getCommentList;
exports.likeArticle = likeArticle;
exports.dislikeArticle = dislikeArticle;
const superstruct_1 = require("superstruct");
const prismaClient_1 = require("../lib/prismaClient");
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const commonStructs_1 = require("../structs/commonStructs");
const articlesStructs_1 = require("../structs/articlesStructs");
const commentsStruct_1 = require("../structs/commentsStruct");
const UnauthorizeError_1 = __importDefault(require("../lib/errors/UnauthorizeError"));
const articleService_1 = require("../service/articleService");
function createArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, articlesStructs_1.CreateArticleBodyStruct);
        const result = yield articleService_1.articleService.createArticle(data, req.user);
        return res.status(201).send({ message: 'article 생성됨', result });
    });
}
function getArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const result = yield articleService_1.articleService.getArticle(id, req.user);
        return res.send({ article: result.article, isLike: Boolean(result.isLike) });
    });
}
function updateArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const data = (0, superstruct_1.create)(req.body, articlesStructs_1.UpdateArticleBodyStruct);
        const result = yield articleService_1.articleService.updateArticle(id, data, req.user);
        return res.send({ message: 'article 수정됨', result });
    });
}
function deleteArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const result = yield articleService_1.articleService.deleteArticle(id, req.user);
        return res.status(204).send({ message: 'article 삭제됨', article: result });
    });
}
function getArticleList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = (0, superstruct_1.create)(req.query, articlesStructs_1.GetArticleListParamsStruct);
        const result = yield articleService_1.articleService.getListArticle(params);
        return res.send(result);
    });
}
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: articleId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { content } = (0, superstruct_1.create)(req.body, commentsStruct_1.CreateCommentBodyStruct);
        const user = req.user;
        const existingArticle = yield prismaClient_1.prismaClient.article.findUnique({ where: { id: articleId } });
        if (!existingArticle) {
            throw new NotFoundError_1.default('article', articleId);
        }
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        const comment = yield prismaClient_1.prismaClient.comment.create({
            data: {
                articleId,
                content,
                authorId: user.id,
            },
        });
        return res.status(201).send(comment);
    });
}
function getCommentList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: articleId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { cursor, limit } = (0, superstruct_1.create)(req.query, commentsStruct_1.GetCommentListParamsStruct);
        const article = yield prismaClient_1.prismaClient.article.findUnique({ where: { id: articleId } });
        if (!article) {
            throw new NotFoundError_1.default('article', articleId);
        }
        const commentsWithCursor = yield prismaClient_1.prismaClient.comment.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            take: limit + 1,
            where: { articleId },
            orderBy: { createdAt: 'desc' },
        });
        const comments = commentsWithCursor.slice(0, limit);
        const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
        const nextCursor = cursorComment ? cursorComment.id : null;
        return res.send({
            list: comments,
            nextCursor,
        });
    });
}
function likeArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
            if (!req.user) {
                throw new UnauthorizeError_1.default();
            }
            const userId = req.user.id;
            const like = yield prismaClient_1.prismaClient.likeArticle.create({ data: { userId, articleId: id } });
            res.status(200).send({ message: 'Like!', like });
        }
        catch (err) {
            return res.status(400).send('already liked Article!');
        }
    });
}
function dislikeArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
            if (!req.user) {
                throw new UnauthorizeError_1.default();
            }
            const userId = req.user.id;
            const likeArticleFind = yield prismaClient_1.prismaClient.likeArticle.findFirst({
                where: { articleId: id, userId: userId },
            });
            //이부분 질문 필요
            if (!likeArticleFind) {
                throw new NotFoundError_1.default('no liked Article', likeArticleFind.id);
            }
            const dislikeArticle = yield prismaClient_1.prismaClient.likeArticle.delete({
                where: { id: likeArticleFind.id },
            });
            res.status(200).send({ message: 'Dislike!', dislikeArticle });
        }
        catch (err) {
            return res.status(400).send('already disliked Article');
        }
    });
}
