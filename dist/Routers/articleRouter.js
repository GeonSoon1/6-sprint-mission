"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../libs/constants");
const catchAsync_1 = require("../libs/catchAsync");
const auth_1 = __importDefault(require("../middlewares/auth"));
const articleController_1 = __importDefault(require("../controller/articleController"));
const articleRouter = constants_1.EXPRESS.Router();
const articleController = new articleController_1.default();
articleRouter.route('/')
    .get(auth_1.default.softVerifyAccessToken, (0, catchAsync_1.catchAsync)(articleController.getArticles))
    .post(auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(articleController.postArticle));
articleRouter.route('/:id')
    .get(auth_1.default.softVerifyAccessToken, (0, catchAsync_1.catchAsync)(articleController.getArticleById))
    .patch(auth_1.default.verifyAccessToken, auth_1.default.verifyArticleAuth, (0, catchAsync_1.catchAsync)(articleController.patchArticleById))
    .delete(auth_1.default.verifyAccessToken, auth_1.default.verifyArticleAuth, (0, catchAsync_1.catchAsync)(articleController.deleteArticleById));
articleRouter.post('/:id/like', auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(articleController.likeArticle));
exports.default = articleRouter;
//# sourceMappingURL=articleRouter.js.map