"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../../upload"));
const image_controller_1 = require("./image.controller");
const asyncHandler_1 = require("../../libs/asyncHandler");
const imageRouter = express_1.default.Router();
imageRouter.post('/', upload_1.default.single('image'), (0, asyncHandler_1.asyncHandler)(image_controller_1.uploadSingleImage));
exports.default = imageRouter;
//# sourceMappingURL=image.router.js.map