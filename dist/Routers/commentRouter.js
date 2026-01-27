"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../libs/constants");
const catchAsync_1 = require("../libs/catchAsync");
const auth_1 = __importDefault(require("../middlewares/auth"));
const commentController_1 = require("../controller/commentController");
const commentRouter = constants_1.EXPRESS.Router();
commentRouter.route('/')
    .get((0, catchAsync_1.catchAsync)(commentController_1.GetComment))
    .post(auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(commentController_1.PostComment));
commentRouter.route('/:id')
    .get((0, catchAsync_1.catchAsync)(commentController_1.GetCommentById))
    .patch(auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsyncAll)(auth_1.default.verifyProduectAuth, commentController_1.PatchCommentById))
    .delete(auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsyncAll)(auth_1.default.verifyProduectAuth, commentController_1.DeleteCommentById));
exports.default = commentRouter;
//# sourceMappingURL=commentRouter.js.map