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
exports.getArticles = getArticles;
exports.getArticleById = getArticleById;
exports.createArticle = createArticle;
exports.getMyArticles = getMyArticles;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
exports.toggleArticleLike = toggleArticleLike;
const articleService_1 = require("../services/articleService");
function getArticles(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cookies = req.cookies;
            const data = yield (0, articleService_1.getArticlesService)(cookies);
            return res.status(200).json(data);
        }
        catch (e) {
            next(e);
        }
    });
}
function getArticleById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cookies = req.cookies;
            const data = yield (0, articleService_1.getArticleByIdService)(req.params.id, cookies);
            return res.status(200).json(data);
        }
        catch (e) {
            next(e);
        }
    });
}
function createArticle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const body = req.body;
            const article = yield (0, articleService_1.createArticleService)(body, userId);
            return res.status(201).json(article);
        }
        catch (e) {
            next(e);
        }
    });
}
function getMyArticles(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const articles = yield (0, articleService_1.getMyArticlesService)(userId);
            return res.status(200).json(articles);
        }
        catch (e) {
            next(e);
        }
    });
}
function updateArticle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const body = req.body;
            const updated = yield (0, articleService_1.updateArticleService)(req.params.id, body, userId);
            return res.status(200).json(updated);
        }
        catch (e) {
            next(e);
        }
    });
}
function deleteArticle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            yield (0, articleService_1.deleteArticleService)(req.params.id, userId);
            return res.status(204).send();
        }
        catch (e) {
            next(e);
        }
    });
}
function toggleArticleLike(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const result = yield (0, articleService_1.toggleArticleLikeService)(req.params.id, userId);
            return res.status(200).json(result);
        }
        catch (e) {
            next(e);
        }
    });
}
