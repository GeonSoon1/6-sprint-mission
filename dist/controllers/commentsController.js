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
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
const superstruct_1 = require("superstruct");
const prismaClient_1 = require("../lib/prismaClient");
const commentsStruct_1 = require("../structs/commentsStruct");
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const commonStructs_1 = require("../structs/commonStructs");
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const UnauthorizeError_1 = __importDefault(require("../lib/errors/UnauthorizeError"));
function updateComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { content } = (0, superstruct_1.create)(req.body, commentsStruct_1.UpdateCommentBodyStruct);
        const user = req.user;
        const existingComment = yield prismaClient_1.prismaClient.comment.findUnique({ where: { id } });
        if (!existingComment) {
            throw new NotFoundError_1.default('comment', id);
        }
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        if (existingComment.authorId !== user.id) {
            throw new ForbiddenError_1.default('comment');
        }
        const updatedComment = yield prismaClient_1.prismaClient.comment.update({
            where: { id },
            data: { content },
        });
        return res.send({ message: 'comment 수정됨', updatedComment });
    });
}
function deleteComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const user = req.user;
        const existingComment = yield prismaClient_1.prismaClient.comment.findUnique({ where: { id } });
        if (!existingComment) {
            throw new NotFoundError_1.default('comment', id);
        }
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        if (existingComment.authorId !== user.id) {
            throw new ForbiddenError_1.default('comment');
        }
        yield prismaClient_1.prismaClient.comment.delete({ where: { id } });
        return res.status(204).send({ message: 'comment 삭제됨', existingComment });
    });
}
