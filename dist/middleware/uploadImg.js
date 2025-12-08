"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadUserImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const constants_1 = require("../lib/constants");
// 파일 작업 상수 선언
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
// 5MB 파일 크기 제한
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
// Multer 저장소 설정
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, constants_1.PUBLIC_PATH);
    },
    filename(req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        // const fileReName = `${Date.now()}_${file.originalname}`;
        const filename = `${(0, uuid_1.v4)()}${ext}`;
        cb(null, filename);
    },
});
// 이미지 MIME 필터
function imageFileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        req.fileValidationError = '이미지 파일만 업로드할 수 있습니다!';
        return cb(null, false);
    }
    cb(null, true);
}
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter: imageFileFilter,
});
// 프론트에서 업로드 필드명
exports.uploadUserImage = upload.single('image');
