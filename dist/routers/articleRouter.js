"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middleware/asyncHandler");
const articleController_1 = require("../controllers/articleController");
const validation_1 = require("../middleware/validation");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const router = express_1.default.Router();
router
    .route('/')
    .get((0, asyncHandler_1.asyncHandler)(articleController_1.getArticles))
    .post(authenticate_1.default, validation_1.validateArticle, (0, asyncHandler_1.asyncHandler)(articleController_1.createArticle));
// 내가 작성한 게시글
router.get('/me', authenticate_1.default, (0, asyncHandler_1.asyncHandler)(articleController_1.getMyArticles));
// 게시글 좋아요 토글
router.post('/:id/like', authenticate_1.default, (0, asyncHandler_1.asyncHandler)(articleController_1.toggleArticleLike));
router
    .route('/:id')
    .get((0, asyncHandler_1.asyncHandler)(articleController_1.getArticleById))
    .patch(authenticate_1.default, (0, asyncHandler_1.asyncHandler)(articleController_1.updateArticle))
    .delete(authenticate_1.default, (0, asyncHandler_1.asyncHandler)(articleController_1.deleteArticle));
exports.default = router;
