"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.AWS_BUCKET_NAME = exports.AWS_REGION = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.JWT_SECRET = exports.STATIC_PATH = exports.PORT = exports.DATABASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DATABASE_URL = process.env.DATABASE_URL; // !를 써서 있다고 단언
exports.PORT = process.env.PORT || 3001;
exports.STATIC_PATH = '/public'; // 리터럴 타입
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
exports.AWS_REGION = process.env.AWS_REGION;
exports.AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
exports.NODE_ENV = process.env.NODE_ENV;
//# sourceMappingURL=constants.js.map