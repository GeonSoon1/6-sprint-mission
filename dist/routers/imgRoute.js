"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("../lib/asyncHandler"));
const multer_1 = __importDefault(require("multer"));
const uploadImg_1 = require("../middleware/uploadImg");
const img_controller_1 = require("../controllers/img-controller");
const imgRouter = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'files/' });
// imgRouter.post(
//   '/',
//   upload.single('attachment'),
//   asyncHandler(uploadImgController)
// );
imgRouter.post('/', uploadImg_1.uploadUserImage, (0, asyncHandler_1.default)(img_controller_1.uploadImgController));
exports.default = imgRouter;
