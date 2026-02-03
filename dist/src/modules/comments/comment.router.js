"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateComment_1 = require("../../middlewares/validates/validateComment");
const asyncHandler_1 = require("../../libs/asyncHandler");
const validateId_1 = require("../../middlewares/validates/validateId");
const comment_controller_1 = require("./comment.controller");
const auth_1 = require("../../middlewares/auth");
const commentRouter = express_1.default.Router();
commentRouter
    .route('/product/:productId')
    .post(auth_1.verifyAccessToken, auth_1.authorizeUser, validateId_1.validateProductIdParam, validateComment_1.validateCreateComment, (0, asyncHandler_1.asyncHandler)(comment_controller_1.commentController.createProductComment.bind(comment_controller_1.commentController)))
    .get(validateId_1.validateProductIdParam, validateComment_1.validateGetListComment, (0, asyncHandler_1.asyncHandler)(comment_controller_1.commentController.getCommentsByProductId.bind(comment_controller_1.commentController)));
commentRouter
    .route('/article/:articleId')
    .post(auth_1.verifyAccessToken, auth_1.authorizeUser, validateId_1.validateArticleIdParam, validateComment_1.validateCreateComment, (0, asyncHandler_1.asyncHandler)(comment_controller_1.commentController.createArticleComment.bind(comment_controller_1.commentController)))
    .get(validateId_1.validateArticleIdParam, validateComment_1.validateGetListComment, (0, asyncHandler_1.asyncHandler)(comment_controller_1.commentController.getCommentsByArticle.bind(comment_controller_1.commentController)));
commentRouter
    .route('/:id')
    .patch(auth_1.verifyAccessToken, auth_1.authorizeUser, validateId_1.validateIdParam, validateComment_1.validateUpdateComment, auth_1.authorizeComment, (0, asyncHandler_1.asyncHandler)(comment_controller_1.commentController.update.bind(comment_controller_1.commentController)))
    .delete(auth_1.verifyAccessToken, auth_1.authorizeUser, validateId_1.validateIdParam, auth_1.authorizeComment, (0, asyncHandler_1.asyncHandler)(comment_controller_1.commentController.delete.bind(comment_controller_1.commentController)));
exports.default = commentRouter;
//# sourceMappingURL=comment.router.js.map