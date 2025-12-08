"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const errorHandler = (err, req, res, next) => {
    var _a, _b;
    if (!err) {
        // err = undefined, null 인 경우
        return res.status(500).send({ message: 'Unknown Server error' });
    }
    // Prisma 에러 처리
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2025': // Record not found
                return res.status(404).json({
                    status: 404,
                    message: `Cannot find, ${((_a = err.meta) === null || _a === void 0 ? void 0 : _a.cause) || err.message}`,
                });
            case 'P2002': // Unique constraint failed
                return res.status(400).json({
                    status: 400,
                    message: `Unique constraint failed on ${((_b = err.meta) === null || _b === void 0 ? void 0 : _b.target) || 'field'}`,
                });
            case 'P2003': // Foreign key constraint failed
                return res.status(400).json({
                    status: 400,
                    message: 'Foreign key constraint failed',
                });
        }
    }
    // 나머지 에러를 확인하는 작업
    const status = err.status || 500;
    const messages = {
        400: 'Bad Request',
        404: 'Not Found',
        500: 'Unknown Server Error',
    };
    return res.status(status).json({
        status,
        message: err.message || messages[status] || 'Unexpected Error',
    });
};
exports.default = errorHandler;
