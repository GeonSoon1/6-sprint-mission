"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middleware/asyncHandler");
const commentController_1 = require("../controllers/commentController");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router
    .route('/product/:id')
    .get((0, asyncHandler_1.asyncHandler)(commentController_1.getProductComments))
    .post(authenticate_1.default, validation_1.validateComment, (0, asyncHandler_1.asyncHandler)(commentController_1.createProductComment));
router
    .route('/article/:id')
    .get((0, asyncHandler_1.asyncHandler)(commentController_1.getArticleComments))
    .post(authenticate_1.default, validation_1.validateComment, (0, asyncHandler_1.asyncHandler)(commentController_1.createArticleComment));
router
    .route('/:id')
    .patch(authenticate_1.default, validation_1.validateComment, (0, asyncHandler_1.asyncHandler)(commentController_1.updateComment))
    .delete(authenticate_1.default, (0, asyncHandler_1.asyncHandler)(commentController_1.deleteComment));
exports.default = router;
