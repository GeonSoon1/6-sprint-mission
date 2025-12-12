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
exports.productUserCheckValidation = productUserCheckValidation;
exports.proCommentUserCheckValidation = proCommentUserCheckValidation;
exports.articleUserCheckValidation = articleUserCheckValidation;
exports.artCommentUserCheckValidation = artCommentUserCheckValidation;
function productUserCheckValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = req.product;
            const userId = req.userId;
            // Product 작성자와 동일한 user 인지 확인
            if (product.userId !== userId)
                return res
                    .status(401)
                    .json({ message: '제품을 등록한 사용자가 아닙니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function proCommentUserCheckValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const comment = req.proComment;
            const userId = req.userId;
            // comment 작성자와 동일한 user 인지 확인
            if (comment.userId !== userId)
                return res
                    .status(401)
                    .json({ message: '댓글을 등록한 사용자가 아닙니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function articleUserCheckValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const article = req.article;
            const userId = req.userId;
            // Product 작성자와 동일한 user 인지 확인
            if (article.userId !== userId)
                return res
                    .status(401)
                    .json({ message: '제품을 등록한 사용자가 아닙니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function artCommentUserCheckValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const comment = req.artComment;
            const userId = req.userId;
            // comment 작성자와 동일한 user 인지 확인
            if (comment.userId !== userId)
                return res
                    .status(401)
                    .json({ message: '댓글을 등록한 사용자가 아닙니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
