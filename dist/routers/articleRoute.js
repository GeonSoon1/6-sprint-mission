"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("../lib/asyncHandler"));
const a = __importStar(require("../controllers/article-controller"));
const ac = __importStar(require("../controllers/articleComment-controller"));
const al = __importStar(require("../controllers/articleLike-controller"));
const common_dbcheck_validation_1 = require("../validators/common-dbcheck-validation");
const common_permission_validation_1 = require("../validators/common-permission-validation");
const common_query_validation_1 = require("../validators/common-query-validation");
const article_validation_1 = require("../validators/article-validation");
const comment_validation_1 = require("../validators/comment-validation");
const userLike_validation_1 = require("../validators/userLike-validation");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const articleRoute = express_1.default.Router();
// ======= ======= ======= ======= =======
// =======  article 자체 API 명령어  =======
// ======= ======= ======= ======= =======
articleRoute.post('/', authenticate_1.default, article_validation_1.articleCreateValidation, common_dbcheck_validation_1.userDataValidation, (0, asyncHandler_1.default)(a.createArticle));
articleRoute.get('/', common_query_validation_1.getQueryValidation, (0, asyncHandler_1.default)(a.getArticlesList));
articleRoute.get('/:id', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, common_dbcheck_validation_1.articleDataValidation, (0, asyncHandler_1.default)(a.getArticleInfo));
articleRoute.patch('/:id', authenticate_1.default, article_validation_1.articleUpdateValidation, common_dbcheck_validation_1.userDataValidation, common_dbcheck_validation_1.articleDataValidation, common_permission_validation_1.articleUserCheckValidation, (0, asyncHandler_1.default)(a.updateArticle));
articleRoute.delete('/:id', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, common_dbcheck_validation_1.articleDataValidation, common_permission_validation_1.articleUserCheckValidation, (0, asyncHandler_1.default)(a.deleteArticle));
// ======= ======= ======= ======= =======
// ======= article에 연결 된 comment =======
// ======= ======= ======= ======= =======
articleRoute.post('/:articleId/comments', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, common_dbcheck_validation_1.articleDataValidation, comment_validation_1.commentCreateValidation, (0, asyncHandler_1.default)(ac.createArticleComment));
articleRoute.get('/:articleId/comments', common_dbcheck_validation_1.articleDataValidation, (0, asyncHandler_1.default)(ac.getArticleCommentsList));
articleRoute.patch('/:articleId/comments/:commentId', authenticate_1.default, comment_validation_1.commentUpdateValidation, common_dbcheck_validation_1.userDataValidation, common_dbcheck_validation_1.articleDataValidation, common_dbcheck_validation_1.articleCommentDataValidation, common_permission_validation_1.artCommentUserCheckValidation, (0, asyncHandler_1.default)(ac.updateArticleComment));
articleRoute.delete('/:articleId/comments/:commentId', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, common_dbcheck_validation_1.articleDataValidation, common_dbcheck_validation_1.articleCommentDataValidation, common_permission_validation_1.artCommentUserCheckValidation, (0, asyncHandler_1.default)(ac.deleteArticleComment));
// ======= ======= ======= ======= =======
// ====== article에 연결 된 likeCount ======
// ======= ======= ======= ======= =======
articleRoute.post('/:id/likeCount', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, common_dbcheck_validation_1.articleDataValidation, userLike_validation_1.articleLikeUpValidation, (0, asyncHandler_1.default)(al.likeCountUp));
articleRoute.delete('/:id/likeCount', authenticate_1.default, common_dbcheck_validation_1.userDataValidation, common_dbcheck_validation_1.articleDataValidation, userLike_validation_1.articleLikeDownValidation, (0, asyncHandler_1.default)(al.likeCountDown));
exports.default = articleRoute;
