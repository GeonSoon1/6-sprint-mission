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
exports.articleService = void 0;
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const UnauthorizeError_1 = __importDefault(require("../lib/errors/UnauthorizeError"));
const articleRepository_1 = require("../repository/articleRepository");
exports.articleService = {
    createArticle(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new UnauthorizeError_1.default();
            }
            return articleRepository_1.articleRepository.create(Object.assign(Object.assign({}, data), { authorId: user.id }));
        });
    },
    getArticle(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new UnauthorizeError_1.default();
            }
            const article = yield articleRepository_1.articleRepository.findById(id);
            if (!article) {
                throw new NotFoundError_1.default('article', id);
            }
            const isLike = yield articleRepository_1.articleRepository.isLiked(user.id, id);
            return { article, isLike };
        });
    },
    updateArticle(id, data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new UnauthorizeError_1.default();
            }
            const article = yield articleRepository_1.articleRepository.findById(id);
            if (!article) {
                throw new NotFoundError_1.default('article', id);
            }
            if (article.authorId !== user.id) {
                throw new ForbiddenError_1.default('article');
            }
            return articleRepository_1.articleRepository.update(id, data);
        });
    },
    deleteArticle(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new UnauthorizeError_1.default();
            }
            const article = yield articleRepository_1.articleRepository.findById(id);
            if (!article) {
                throw new NotFoundError_1.default('article', id);
            }
            if (article.authorId !== user.id) {
                throw new ForbiddenError_1.default('article');
            }
            return articleRepository_1.articleRepository.delete(id);
        });
    },
    getListArticle(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, pageSize, orderBy, keyword } = params;
            const where = {
                title: keyword ? { contains: keyword } : undefined,
            };
            const totalCount = articleRepository_1.articleRepository.count(where);
            const list = articleRepository_1.articleRepository.findList({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
                where,
            });
            return { list: list, totalCount: totalCount };
        });
    },
};
