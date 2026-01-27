"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../libs/constants");
const catchAsync_1 = require("../libs/catchAsync");
const auth_1 = __importDefault(require("../middlewares/auth"));
const productController_1 = __importDefault(require("../controller/productController"));
const productRouter = constants_1.EXPRESS.Router();
const productController = new productController_1.default();
productRouter.route('/')
    .get(auth_1.default.softVerifyAccessToken, (0, catchAsync_1.catchAsync)(productController.GetProduct))
    .post(auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(productController.PostProduct));
productRouter.route('/:id')
    .get(auth_1.default.softVerifyAccessToken, (0, catchAsync_1.catchAsync)(productController.GetProductById))
    .patch(auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(productController.PatchProductById))
    .delete(auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(productController.DeleteProductById));
productRouter.post('/:id/like', auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(productController.likeProduct));
exports.default = productRouter;
//# sourceMappingURL=productRouter.js.map