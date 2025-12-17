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
exports.createProductCommentService = createProductCommentService;
exports.createArticleCommentService = createArticleCommentService;
exports.getProductCommentsService = getProductCommentsService;
exports.getArticleCommentsService = getArticleCommentsService;
exports.updateCommentService = updateCommentService;
exports.deleteCommentService = deleteCommentService;
const httpError_1 = require("../lib/httpError");
const commentRepository_1 = require("../repositories/commentRepository");
function normalizeLimit(limit, defaultValue = 10) {
    const n = Number(limit);
    if (!Number.isFinite(n) || n <= 0)
        return defaultValue;
    return Math.min(Math.floor(n), 50);
}
function createProductCommentService(productId, data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield (0, commentRepository_1.findProductById)(productId);
        if (!product)
            throw new httpError_1.HttpError(404, '상품을 찾을 수 없습니다.');
        return (0, commentRepository_1.createProductComment)({
            content: data.content,
            productId,
            userId,
        });
    });
}
function createArticleCommentService(articleId, data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield (0, commentRepository_1.findArticleById)(articleId);
        if (!article)
            throw new httpError_1.HttpError(404, '게시글을 찾을 수 없습니다.');
        return (0, commentRepository_1.createArticleComment)({
            content: data.content,
            articleId,
            userId,
        });
    });
}
function getProductCommentsService(productId, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const limit = normalizeLimit(query.limit, 10);
        const cursor = typeof query.cursor === 'string' ? query.cursor : undefined;
        return (0, commentRepository_1.findProductComments)({ productId, limit, cursor });
    });
}
function getArticleCommentsService(articleId, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const limit = normalizeLimit(query.limit, 10);
        const cursor = typeof query.cursor === 'string' ? query.cursor : undefined;
        return (0, commentRepository_1.findArticleComments)({ articleId, limit, cursor });
    });
}
function updateCommentService(commentId, data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield (0, commentRepository_1.findCommentById)(commentId);
        if (!comment)
            throw new httpError_1.HttpError(404, '댓글을 찾을 수 없습니다.');
        if (comment.userId !== userId) {
            throw new httpError_1.HttpError(403, '댓글을 수정할 권한이 없습니다.');
        }
        return (0, commentRepository_1.updateComment)(commentId, data.content);
    });
}
function deleteCommentService(commentId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield (0, commentRepository_1.findCommentById)(commentId);
        if (!comment)
            throw new httpError_1.HttpError(404, '댓글을 찾을 수 없습니다.');
        if (comment.userId !== userId) {
            throw new httpError_1.HttpError(403, '댓글을 삭제할 권한이 없습니다.');
        }
        yield (0, commentRepository_1.deleteComment)(commentId);
    });
}
