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
exports.productLikeUpValidation = productLikeUpValidation;
exports.productLikeDownValidation = productLikeDownValidation;
exports.articleLikeUpValidation = articleLikeUpValidation;
exports.articleLikeDownValidation = articleLikeDownValidation;
exports.productLikeListValidation = productLikeListValidation;
exports.articleLikeListValidation = articleLikeListValidation;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function productLikeUpValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const productId = req.product.id;
            // 이미 likeCount 증가 했다면 작업 종료
            const readProductLike = yield prismaclient_1.default.productLikes.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            if (readProductLike)
                return res.status(401).json({ message: '이미 좋아요를 눌렀습니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function productLikeDownValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const product = req.product;
            const productId = product.id;
            // likeCount가 0 이하일 경우
            if (product.likeCount < 1)
                return res.status(401).json({ message: '더 이상 감소할 수 없습니다' });
            // 이미 likeCount 감소(삭제) 했다면 작업 종료
            const readProductLike = yield prismaclient_1.default.productLikes.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            if (!readProductLike)
                return res.status(401).json({ message: '이미 취소 하였습니다' });
            req.proLikeId = readProductLike.id;
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function articleLikeUpValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const articleId = req.article.id;
            // 이미 likeCount 증가 했다면 작업 종료
            const readProductLike = yield prismaclient_1.default.articleLikes.findUnique({
                where: {
                    userId_articleId: {
                        userId,
                        articleId,
                    },
                },
            });
            if (readProductLike)
                return res.status(401).json({ message: '이미 좋아요를 눌렀습니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function articleLikeDownValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const article = req.article;
            const articleId = article.id;
            // likeCount가 0 이하일 경우
            if (article.likeCount < 1)
                return res.status(401).json({ message: '더 이상 감소할 수 없습니다' });
            // 이미 likeCount 감소(삭제) 했다면 작업 종료
            const readArticleLike = yield prismaclient_1.default.articleLikes.findUnique({
                where: {
                    userId_articleId: {
                        userId,
                        articleId,
                    },
                },
            });
            if (!readArticleLike)
                return res.status(401).json({ message: '이미 취소 하였습니다' });
            req.artLikeId = readArticleLike.id;
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function productLikeListValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const productLikeDB = yield prismaclient_1.default.productLikes.findMany({
                where: { userId },
            });
            if (productLikeDB.length === 0)
                return res
                    .status(401)
                    .json({ message: '좋아요 한 제품 목록이 없습니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function articleLikeListValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const articleLikeDB = yield prismaclient_1.default.articleLikes.findMany({
                where: { userId },
            });
            if (articleLikeDB.length === 0)
                return res
                    .status(401)
                    .json({ message: '좋아요 한 게시글 목록이 없습니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
