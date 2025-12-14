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
exports.createProductComment = createProductComment;
exports.createArticleComment = createArticleComment;
exports.getProductComments = getProductComments;
exports.getArticleComments = getArticleComments;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
const commentService_1 = require("../services/commentService");
function createProductComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const body = req.body;
            const comment = yield (0, commentService_1.createProductCommentService)(req.params.id, body, userId);
            return res.status(201).json(comment);
        }
        catch (e) {
            next(e);
        }
    });
}
function createArticleComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const body = req.body;
            const comment = yield (0, commentService_1.createArticleCommentService)(req.params.id, body, userId);
            return res.status(201).json(comment);
        }
        catch (e) {
            next(e);
        }
    });
}
function getProductComments(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const comments = yield (0, commentService_1.getProductCommentsService)(req.params.id, req.query);
            return res.json(comments);
        }
        catch (e) {
            next(e);
        }
    });
}
function getArticleComments(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const comments = yield (0, commentService_1.getArticleCommentsService)(req.params.id, req.query);
            return res.json(comments);
        }
        catch (e) {
            next(e);
        }
    });
}
function updateComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const body = req.body;
            const updated = yield (0, commentService_1.updateCommentService)(req.params.id, body, userId);
            return res.json(updated);
        }
        catch (e) {
            next(e);
        }
    });
}
function deleteComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            yield (0, commentService_1.deleteCommentService)(req.params.id, userId);
            return res.sendStatus(204);
        }
        catch (e) {
            next(e);
        }
    });
}
