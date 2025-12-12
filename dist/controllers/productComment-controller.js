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
exports.createProductComment = createProductComment;
exports.getProductCommentList = getProductCommentList;
exports.updateProductComment = updateProductComment;
exports.deleteProductComment = deleteProductComment;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function createProductComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const productId = req.product.id;
        const { content } = req.body;
        const commentCreate = yield prismaclient_1.default.commentProduct.create({
            data: {
                content,
                userId,
                productId,
            },
            include: {
                product: true,
            },
        });
        res.status(201).json(commentCreate);
    });
}
function getProductCommentList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = req.product.id;
        const productComments = yield prismaclient_1.default.product.findUnique({
            where: { id: productId },
            include: {
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!productComments)
            return res
                .status(404)
                .json({ message: '제품의 댓글 목록을 찾을 수 없습니다' });
        res.status(200).json(productComments.comments);
    });
}
function updateProductComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentId = req.proComment.id;
        const commentUpdate = yield prismaclient_1.default.commentProduct.update({
            where: { id: commentId },
            data: req.body,
        });
        res.status(201).json(commentUpdate);
    });
}
function deleteProductComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentId = req.proComment.id;
        yield prismaclient_1.default.commentProduct.delete({
            where: { id: commentId },
        });
        res.status(204).json({ message: '삭제 완료' });
    });
}
