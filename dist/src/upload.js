"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const constants_1 = require("./libs/constants");
const uploadDir = 'uploads';
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const s3 = new client_s3_1.S3Client({
    // credentials: {
    //   accessKeyId: AWS_ACCESS_KEY_ID as string,
    //   secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
    // },
    region: constants_1.AWS_REGION,
});
const storage = constants_1.NODE_ENV === 'production'
    ? (0, multer_s3_1.default)({
        s3: s3,
        bucket: constants_1.AWS_BUCKET_NAME,
        acl: 'public-read',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const ext = path_1.default.extname(file.originalname);
            const basename = path_1.default.basename(file.originalname, ext);
            cb(null, `${basename}-${Date.now()}${ext}`);
        },
    })
    : multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const ext = path_1.default.extname(file.originalname);
            const basename = path_1.default.basename(file.originalname, ext);
            const newFilename = `${basename}-${Date.now()}${ext}`;
            cb(null, newFilename);
        },
    });
// 최신 @type/express 에서는 Request가 generic이 아님 아래와 같게 import 하면 Multer가 요구하는 타입을 그대로 따라가면서 TS가 타입 체크 해줌
const fileFilter = (req, file, cb) => {
    // 확장자를 정할 수 있음
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/jpg',
    ]; // 허용 확장자
    if (allowedMimeTypes.includes(file.mimetype)) {
        // 파일의 확장자가 허용확장자에 포함된다면
        cb(null, true); // 허용
    }
    else {
        cb(null, false); // 거부
    }
};
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 최대 10MB
    fileFilter,
});
exports.default = upload;
//# sourceMappingURL=upload.js.map