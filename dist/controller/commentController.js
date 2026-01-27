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
exports.GetComment = GetComment;
exports.GetCommentById = GetCommentById;
exports.PostComment = PostComment;
exports.PatchCommentById = PatchCommentById;
exports.DeleteCommentById = DeleteCommentById;
const constants_1 = require("../libs/constants");
const superstruct_1 = require("superstruct");
const structs_1 = require("../structs/structs");
const errorHandler_1 = require("../libs/Handler/errorHandler");
function GetComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { take = '10', cursor, productId, articleId } = req.query;
        const parsedTake = parseInt(take, 10) || 0;
        if (isNaN(parsedTake) || parsedTake <= 0) {
            return res.status(400).send({ error: 'Invalid "take" parameter.' });
        }
        const whereClause = {};
        if (productId) {
            whereClause.productId = Number(productId); // 상품 ID로 필터링
        }
        else if (articleId) {
            whereClause.articleId = Number(articleId); // 게시글 ID로 필터링
        }
        const findOptions = {
            take: parsedTake,
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
        };
        if (cursor) {
            const parsedCursor = parseInt(cursor, 10);
            findOptions.skip = 1;
            findOptions.cursor = {
                id: parsedCursor,
            };
        }
        const comments = yield constants_1.prismaClient.comment.findMany(findOptions); // 
        let nextCursor = null;
        if (comments.length > 0 && comments.length === parsedTake) {
            nextCursor = comments[comments.length - 1].id;
        }
        res.status(200).json({
            comments,
            nextCursor,
        });
    });
}
function GetCommentById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const paesedId = parseInt(id, 10) || null;
        if (!paesedId)
            return new errorHandler_1.CustomError(404, "id Not Found");
        const Comment = yield constants_1.prismaClient.comment.findUniqueOrThrow({
            where: {
                id: paesedId
            },
        });
        res.send(Comment);
    });
}
function PostComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, superstruct_1.assert)(req.body, structs_1.CreateComment);
        const { content, productId, articleId } = req.body;
        if ((productId && articleId) || (!productId && !articleId)) {
            return res.status(400).json({
                error: 'Comment must belong to EITHER a Product OR an Article.',
            });
        }
        if (!content || content.trim() === '') {
            return res.status(400).json({ error: 'Content cannot be empty.' });
        }
        const comment = yield constants_1.prismaClient.comment.create({
            data: {
                content: content,
                productId: productId,
                articleId: articleId,
            },
        });
        res.status(201).send(comment);
    });
}
function PatchCommentById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, superstruct_1.assert)(req.body, structs_1.PatchComment);
        const { content } = req.body;
        const { id } = req.params;
        const paesedId = parseInt(id, 10) || null;
        if (!paesedId)
            return new errorHandler_1.CustomError(404, "id Not Found");
        if (content !== undefined && content.trim() === '') {
            return res.status(400).json({ error: 'Content cannot be empty.' });
        }
        const comment = yield constants_1.prismaClient.comment.update({
            where: {
                id: paesedId
            },
            data: {
                content: content,
            },
        });
        res.send(comment);
    });
}
function DeleteCommentById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const paesedId = parseInt(id, 10) || null;
        if (!paesedId)
            return new errorHandler_1.CustomError(404, "id Not Found");
        const Comment = yield constants_1.prismaClient.comment.delete({
            where: {
                id: paesedId
            },
        });
        res.send(Comment);
    });
}
//# sourceMappingURL=commentController.js.map