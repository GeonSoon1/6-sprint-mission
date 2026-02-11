"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt"); // express-jwt 라이브러리 임포트 (JWT 검증 미들웨어 생성용)
const productRepository_1 = __importDefault(require("../repositories/productRepository")); // 상품 데이터 접근을 위한 레포지토리 임포트
const articleRepository_1 = __importDefault(require("../repositories/articleRepository")); // 게시글 데이터 접근을 위한 레포지토리 임포트
const errorHandler_1 = require("../libs/Handler/errorHandler"); // 커스텀 에러 핸들러 임포트
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // jsonwebtoken 라이브러리 및 타입 임포트
const JWT_SECRET = process.env.JWT_SECRET; // 환경 변수에서 JWT 비밀키를 가져옴
if (!JWT_SECRET) { // 비밀키가 설정되지 않은 경우 에러 발생
    throw new Error('JWT_SECRET is not defined in environment variables.'); // 서버 실행 중단 및 에러 메시지 출력
} // 비밀키 확인 종료
const verifyAccessToken = (0, express_jwt_1.expressjwt)({
    secret: JWT_SECRET, // 검증에 사용할 비밀키 설정
    algorithms: ["HS256"], // 사용할 암호화 알고리즘 지정
    requestProperty: 'user' // 검증된 페이로드를 req.user 객체에 저장하도록 설정
}); // 액세스 토큰 검증 설정 종료
const softVerifyAccessToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Authorization 헤더에서 'Bearer '를 제외한 토큰 문자열 추출
    if (token) { // 토큰이 존재하는 경우
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (!err && decoded && typeof decoded === 'object') { // 에러가 없고 유효한 객체 형태의 페이로드인 경우
                req.user = decoded; // req.user에 사용자 정보 할당
            } // 유효성 확인 종료
            next(); // 다음 미들웨어로 진행 (검증 실패해도 진행)
        }); // 검증 함수 종료
    }
    else { // 토큰이 없는 경우
        next(); // 바로 다음 미들웨어로 진행
    } // 토큰 존재 여부 확인 종료
}; // softVerifyAccessToken 종료
const verifyRefreshToken = (0, express_jwt_1.expressjwt)({
    secret: JWT_SECRET, // 검증용 비밀키
    algorithms: ['HS256'], // 알고리즘
    getToken: (req) => req.cookies.refreshToken, // 쿠키에서 리프레시 토큰을 가져오도록 설정
}); // 리프레시 토큰 검증 설정 종료
function verifyProduectAuth // 상품 수정/삭제 권한 확인 함수
(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id || ""; // URL 파라미터에서 상품 ID 추출
        if (!id)
            throw new errorHandler_1.CustomError(404, "id가 비 정상적인 값 입니다"); // ID가 없으면 404 에러 발생
        const idtoNumber = parseInt(id); // 문자열 ID를 숫자로 변환
        const product = yield productRepository_1.default.findById(idtoNumber); // DB에서 해당 상품 조회
        if (!product) { // 상품이 존재하지 않는 경우
            throw new errorHandler_1.CustomError(404, 'product not found'); // 404 에러 발생
        } // 상품 존재 확인 종료
        // 사용자 정보가 없거나, 상품의 소유자 ID(현재 product.id로 되어있으나 보통 product.userId)가 요청자 ID와 다르면 권한 없음 처리
        if (typeof req.user !== 'object' || req.user.userId === undefined || product.id !== req.user.userId) {
            throw new errorHandler_1.CustomError(403, 'Forbidden'); // 403 금지 에러 발생
        } // 권한 확인 종료
        return next(); // 권한이 확인되면 다음 미들웨어로 진행
    });
}
; // verifyProduectAuth 종료
function verifyArticleAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id; // URL 파라미터에서 게시글 ID 추출
        if (!id)
            throw new errorHandler_1.CustomError(404, "id가 비 정상적인 값 입니다"); // ID가 없으면 404 에러 발생
        const idtoNumber = parseInt(id); // 문자열 ID를 숫자로 변환
        const article = yield articleRepository_1.default.findById(idtoNumber); // DB에서 해당 게시글 조회
        if (!article) { // 게시글이 존재하지 않는 경우
            throw new errorHandler_1.CustomError(404, 'article not found'); // 404 에러 발생
        } // 게시글 존재 확인 종료
        // 사용자 정보가 없거나, 게시글의 소유자 ID(현재 article.id로 되어있으나 보통 article.userId)가 요청자 ID와 다르면 권한 없음 처리
        if (typeof req.user !== 'object' || req.user.userId === undefined || article.id !== req.user.userId) {
            throw new errorHandler_1.CustomError(403, 'Forbidden'); // 403 금지 에러 발생
        } // 권한 확인 종료
        return next(); // 권한이 확인되면 다음 미들웨어로 진행
    });
} // verifyArticleAuth 종료
exports.default = {
    verifyAccessToken,
    softVerifyAccessToken,
    verifyProduectAuth,
    verifyArticleAuth,
    verifyRefreshToken,
};
//# sourceMappingURL=auth.js.map