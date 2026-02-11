"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.CustomError = void 0;
const multer_1 = __importDefault(require("multer"));
const constants_1 = require("./../constants");
const errorHandler = (err, req, res, next) => {
    // 1. Prisma 초기화 에러 (DB 연결 실패 등)
    if (err instanceof constants_1.Prisma.PrismaClientInitializationError) {
        return res.status(500).json({
            success: false,
            message: '데이터베이스 연결에 실패했습니다. DATABASE_URL을 확인해주세요.'
        });
    }
    // 2. Prisma 요청 에러 (중복 키, 데이터 없음 등)
    if (err instanceof constants_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: '중복된 데이터가 존재합니다.'
            });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: '요청한 데이터를 찾을 수 없습니다.'
            });
        }
    }
    // 3. Multer(파일 업로드) 에러
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: '파일 크기가 너무 큽니다.',
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: '파일 개수가 너무 많습니다.',
            });
        }
    }
    // 4. CustomError 및 기타 에러 처리
    // any 타입이므로 안전하게 접근하기 위해 || 연산자 활용
    const statusCode = err.statusCode || 500;
    const message = err.message || '서버 오류가 발생했습니다.';
    // path가 없는 에러 객체도 많으므로 안전하게 처리
    const path = err.data || null;
    console.error(`[Error] ${statusCode} - ${message}`, err.stack);
    return res.status(statusCode).json({
        success: false,
        message,
        path
    });
};
exports.default = errorHandler;
/**
 * 모든 커스텀 에러의 기본이 되는 클래스
 * HTTP 상태 코드와 메시지를 포함하여 Global Error Handler가 쉽게 처리할 수 있도록 합니다.
 */
class CustomError extends Error {
    constructor(statusCode = 500, message = '', data = {}) {
        super(message);
        this.statusCode = statusCode;
        // Error stack 추적을 위해 클래스 이름 설정
        this.name = this.constructor.name;
        this.data = data;
        // 생성자 함수를 호출 스택에서 제외
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const globalErrorHandler = (err, req, res, next) => {
    // CustomError가 아닌 경우 (예: 서버 내부 오류), 500 상태 코드와 일반 메시지를 사용합니다.
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    // 에러를 콘솔에 기록
    console.error(`[${err.name} - ${statusCode}] ${err.message}`, err.stack);
    res.status(statusCode).json({
        status: 'error',
        message: message,
        // 개발 환경에서만 스택 트레이스를 포함할 수 있습니다.
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=errorHandler.js.map