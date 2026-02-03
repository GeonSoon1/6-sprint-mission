"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateArticle_1 = require("../../middlewares/validates/validateArticle");
const asyncHandler_1 = require("../../libs/asyncHandler");
const validateId_1 = require("../../middlewares/validates/validateId");
const article_controller_1 = require("./article.controller");
const auth_1 = require("../../middlewares/auth");
const articleRouter = express_1.default.Router();
articleRouter
    .route('/')
    .post(auth_1.verifyAccessToken, auth_1.authorizeUser, validateArticle_1.validateCreateArticle, (0, asyncHandler_1.asyncHandler)(article_controller_1.articleController.create.bind(article_controller_1.articleController)) // bind: this고정 : 클래스 메서드를 라우터에 바로 넣으면 this가 사라짐
)
    .get(validateArticle_1.validateGetListArticle, (0, asyncHandler_1.asyncHandler)(article_controller_1.articleController.getArticles.bind(article_controller_1.articleController)));
articleRouter
    .route('/:id')
    .get(validateId_1.validateIdParam, (0, asyncHandler_1.asyncHandler)(article_controller_1.articleController.getById.bind(article_controller_1.articleController)))
    .patch(auth_1.verifyAccessToken, auth_1.authorizeUser, validateId_1.validateIdParam, validateArticle_1.validateUpdateArticle, auth_1.authorizeArticle, (0, asyncHandler_1.asyncHandler)(article_controller_1.articleController.update.bind(article_controller_1.articleController)))
    .delete(auth_1.verifyAccessToken, auth_1.authorizeUser, validateId_1.validateIdParam, auth_1.authorizeArticle, (0, asyncHandler_1.asyncHandler)(article_controller_1.articleController.delete.bind(article_controller_1.articleController)));
exports.default = articleRouter;
//# sourceMappingURL=article.router.js.map