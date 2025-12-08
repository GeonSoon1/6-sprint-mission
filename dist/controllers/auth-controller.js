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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.refreshToken = refreshToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
const authService_1 = require("../server/authService");
const token_1 = require("../lib/token");
const constants_1 = require("../lib/constants");
// 1. 회원가입
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nickname, password, email } = req.body;
        // email 중복 체크
        const checkEmail = yield (0, authService_1.checkUserEmail)(email);
        // 비밀번호 해싱 작업
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // 사용자 등록
        const user = yield prismaclient_1.default.user.create({
            data: {
                nickname,
                email: checkEmail,
                password: hashedPassword,
            },
        });
        // 최종 데이터 전달
        const { password: _ } = user, createUser = __rest(user, ["password"]);
        res.status(200).json(createUser);
    });
}
// 2. 로그인
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        // 사용자 유무 확인
        const userCheck = yield prismaclient_1.default.user.findUnique({ where: { email } });
        if (!userCheck)
            return res.status(401).json({ message: 'Invalid credentials' });
        // 비밀번호 확인
        const isPasswordValid = yield bcrypt_1.default.compare(password, userCheck.password);
        if (!isPasswordValid)
            return res.status(401).json({ message: 'password Recheck please!' });
        // 토큰 생성
        const { accessToken, refreshToken } = (0, token_1.createTokens)(userCheck.id);
        // 생성한 토큰을 쿠키값을 전달
        (0, authService_1.createTokenCookies)(res, accessToken, refreshToken);
        res.status(200).json({ message: 'login ok!' });
    });
}
// 3. 로그아웃
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, authService_1.clearTokenCookies)(res);
        res.status(200).json({ message: 'log out!' });
    });
}
// 4. Refresh Token 재발급
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // 기존 refresh 토큰 받아온 뒤 검증
        const refreshToken = req.cookies[constants_1.REFRESH_TOKEN_COOKIE_NAME];
        if (!refreshToken)
            return res.status(401).json({ message: 'Unauthorized' });
        // User ID 추출
        const { userId } = (0, token_1.verifyRefreshToken)(refreshToken);
        // User Id 검증
        const user = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        // console.log(user);
        // 신규 토큰 생성 작업
        const { accessToken, refreshToken: newRefreshToken } = (0, token_1.createTokens)(user.id);
        // 신규 토큰을 쿠키에 담음
        (0, authService_1.createTokenCookies)(res, accessToken, newRefreshToken);
        res.status(200).json({ message: '재발급 완료' });
    });
}
