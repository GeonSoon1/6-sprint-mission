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
exports.checkUserEmail = checkUserEmail;
exports.createTokenCookies = createTokenCookies;
exports.clearTokenCookies = clearTokenCookies;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
const constants_1 = require("../lib/constants");
function checkUserEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const findEmail = yield prismaclient_1.default.user.findUnique({ where: { email } });
        if (findEmail)
            throw new Error('Email already exists is DB');
        return email;
    });
}
function createTokenCookies(res, accessToken, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        // access token cookie 생성
        res.cookie(constants_1.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
            httpOnly: true,
            secure: constants_1.NODE_ENV === 'production',
            maxAge: 1 * 60 * 60 * 1000, // 1hour
        });
        // refresh token cookie 생성
        res.cookie(constants_1.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: constants_1.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7day
            path: '/auth/refresh',
        });
    });
}
function clearTokenCookies(res) {
    res.clearCookie(constants_1.ACCESS_TOKEN_COOKIE_NAME);
}
