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
exports.getArticlesService = getArticlesService;
exports.getArticleByIdService = getArticleByIdService;
exports.createArticleService = createArticleService;
exports.getMyArticlesService = getMyArticlesService;
exports.updateArticleService = updateArticleService;
exports.deleteArticleService = deleteArticleService;
exports.toggleArticleLikeService = toggleArticleLikeService;
const httpError_1 = require("../lib/httpError");
const articleRepository_1 = require("../repositories/articleRepository");
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
function mapWithLike(article, userId) {
    const likeCount = article.likes.length;
    const isLiked = userId
        ? article.likes.some((l) => l.userId === userId)
        : false;
    const { likes } = article, rest = __rest(article, ["likes"]);
    return Object.assign(Object.assign({}, rest), { likeCount, isLiked });
}
function getArticlesService(cookies) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = getOptionalUserId(cookies);
        // repo가 include: { likes: true } 이므로 실제로 likes가 붙어서 옴
        const articles = (yield (0, articleRepository_1.findArticlesWithLikes)());
        return articles.map((a) => mapWithLike(a, userId));
    });
}
function getArticleByIdService(id, cookies) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = getOptionalUserId(cookies);
        const article = (yield (0, articleRepository_1.findArticleByIdWithLikes)(id));
        if (!article)
            throw new httpError_1.HttpError(404, '게시글을 찾을 수 없습니다.');
        return mapWithLike(article, userId);
    });
}
function createArticleService(data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, articleRepository_1.createArticle)(Object.assign(Object.assign({}, data), { userId }));
    });
}
function getMyArticlesService(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, articleRepository_1.findMyArticles)(userId);
    });
}
function updateArticleService(id, data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield (0, articleRepository_1.findArticleById)(id);
        if (!article)
            throw new httpError_1.HttpError(404, '게시글을 찾을 수 없습니다.');
        if (article.userId !== userId)
            throw new httpError_1.HttpError(403, '게시글을 수정할 권한이 없습니다.');
        return (0, articleRepository_1.updateArticle)(id, data);
    });
}
function deleteArticleService(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield (0, articleRepository_1.findArticleById)(id);
        if (!article)
            throw new httpError_1.HttpError(404, '게시글을 찾을 수 없습니다.');
        if (article.userId !== userId)
            throw new httpError_1.HttpError(403, '게시글을 삭제할 권한이 없습니다.');
        yield (0, articleRepository_1.deleteArticle)(id);
    });
}
function toggleArticleLikeService(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield (0, articleRepository_1.findArticleById)(articleId);
        if (!article)
            throw new httpError_1.HttpError(404, '게시글을 찾을 수 없습니다.');
        const existing = yield (0, articleRepository_1.findArticleLike)(userId, articleId);
        if (existing)
            yield (0, articleRepository_1.deleteArticleLike)(existing.id);
        else
            yield (0, articleRepository_1.createArticleLike)(userId, articleId);
        const likeCount = yield (0, articleRepository_1.countArticleLikes)(articleId);
        return { isLiked: !existing, likeCount };
    });
}
