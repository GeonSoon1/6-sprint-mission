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
exports.userDataValidation = userDataValidation;
exports.productDataValidation = productDataValidation;
exports.productCommentDataValidation = productCommentDataValidation;
exports.articleDataValidation = articleDataValidation;
exports.articleCommentDataValidation = articleCommentDataValidation;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function userDataValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // user 정보 검증
            if (!req.user)
                return res.status(401).json({ message: '사용자 정보를 확인 해 주세요' });
            const userId = Number(req.user.id);
            const userIdFloat = userId % 1;
            if (userId <= 0 || userIdFloat)
                return res.status(401).json({ message: '유효한 사용자 ID가 아닙니다' });
            const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
            if (!findUser)
                return res
                    .status(401)
                    .json({ message: '사용자 정보를 찾을 수 없습니다' });
            req.userId = userId;
            req.user = findUser;
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function productDataValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // product 정보 검증
            const productId = Number(req.params.id);
            const productIdFloat = productId % 1;
            if (productId <= 0 || productIdFloat)
                return res.status(401).json({ message: '유효한 제품 ID가 아닙니다' });
            const product = yield prismaclient_1.default.product.findUnique({
                where: { id: productId },
            });
            if (!product)
                return res.status(401).json({ message: '제품 정보를 찾을 수 없습니다.' });
            req.product = product;
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function productCommentDataValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // comment 정보 검증
            const commentId = Number(req.params.commentId);
            const commentIdFloat = commentId % 1;
            if (commentId <= 0 || commentIdFloat)
                return res.status(401).json({ message: '유효한 댓글 ID가 아닙니다' });
            const comment = yield prismaclient_1.default.commentProduct.findUnique({
                where: { id: commentId },
            });
            if (!comment)
                return res.status(404).json({ message: '댓글 정보를 찾을 수 없습니다' });
            req.proComment = comment;
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function articleDataValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // article 정보 검증
            const articleId = Number(req.params.id);
            const articleIdFloat = articleId % 1;
            if (articleId <= 0 || articleIdFloat)
                return res.status(401).json({ message: '유효한 게시글 ID가 아닙니다' });
            const article = yield prismaclient_1.default.article.findUnique({
                where: { id: articleId },
            });
            if (!article)
                return res
                    .status(401)
                    .json({ message: '게시글 정보를 찾을 수 없습니다.' });
            req.article = article;
        }
        catch (err) {
            next(err);
        }
    });
}
function articleCommentDataValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // comment 정보 검증
            const commentId = Number(req.params.commentId);
            const commentIdFloat = commentId % 1;
            if (commentId <= 0 || commentIdFloat)
                return res.status(401).json({ message: '유효한 댓글 ID가 아닙니다' });
            const comment = yield prismaclient_1.default.commentArticle.findUnique({
                where: { id: commentId },
            });
            if (!comment)
                return res.status(404).json({ message: '댓글 정보를 찾을 수 없습니다' });
            req.artComment = comment;
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
