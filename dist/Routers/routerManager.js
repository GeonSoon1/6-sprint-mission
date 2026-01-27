"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterManager = void 0;
const constants_1 = require("../libs/constants");
const productRouter_1 = __importDefault(require("./productRouter"));
const articleRouter_1 = __importDefault(require("./articleRouter"));
const commentRouter_1 = __importDefault(require("./commentRouter"));
const uploadRouter_1 = __importDefault(require("./uploadRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
exports.RouterManager = constants_1.EXPRESS.Router();
exports.RouterManager.use('/products', productRouter_1.default);
exports.RouterManager.use('/articles', articleRouter_1.default);
exports.RouterManager.use('/comments', commentRouter_1.default);
exports.RouterManager.use('/files', uploadRouter_1.default);
exports.RouterManager.use('/user', userRouter_1.default);
//# sourceMappingURL=routerManager.js.map