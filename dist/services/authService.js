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
exports.buildAccessCookie = buildAccessCookie;
exports.buildRefreshCookie = buildRefreshCookie;
exports.registerService = registerService;
exports.loginService = loginService;
exports.refreshService = refreshService;
exports.logoutService = logoutService;
exports.getMeService = getMeService;
exports.updateProfileService = updateProfileService;
exports.changePasswordService = changePasswordService;
const bcrypt_1 = __importDefault(require("bcrypt"));
const httpError_1 = require("../lib/httpError");
const authRepository_1 = require("../repositories/authRepository");
const constants_1 = require("../lib/constants");
const token_1 = require("../lib/token");
function buildAccessCookie(accessToken) {
    return {
        name: constants_1.ACCESS_TOKEN_COOKIE_NAME,
        value: accessToken,
        options: {
            httpOnly: true,
            secure: constants_1.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000,
        },
    };
}
function buildRefreshCookie(refreshToken) {
    return {
        name: constants_1.REFRESH_TOKEN_COOKIE_NAME,
        value: refreshToken,
        options: {
            httpOnly: true,
            secure: constants_1.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/auth/refresh',
        },
    };
}
function registerService(dto) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, nickname, password } = dto;
        if (!email || !nickname || !password) {
            throw new httpError_1.HttpError(400, '모든 필드를 입력해주세요.');
        }
        const existedEmail = yield (0, authRepository_1.findUserByEmail)(email);
        if (existedEmail)
            throw new httpError_1.HttpError(409, '이미 사용 중인 이메일입니다.');
        const existedNickname = yield (0, authRepository_1.findUserByNickname)(nickname);
        if (existedNickname)
            throw new httpError_1.HttpError(409, '이미 사용 중인 닉네임입니다.');
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield (0, authRepository_1.createUser)({ email, nickname, password: hashedPassword });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return userWithoutPassword;
    });
}
function loginService(dto) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = dto;
        const user = yield (0, authRepository_1.findUserByEmail)(email);
        if (!user)
            throw new httpError_1.HttpError(401, '이메일 또는 비밀번호가 잘못되었습니다.');
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isValid)
            throw new httpError_1.HttpError(401, '이메일 또는 비밀번호가 잘못되었습니다.');
        const { accessToken, refreshToken } = (0, token_1.generateTokens)(user.id);
        return {
            cookies: [buildAccessCookie(accessToken), buildRefreshCookie(refreshToken)],
            body: { message: '로그인 성공' },
        };
    });
}
function refreshService(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!refreshToken)
            throw new httpError_1.HttpError(401, 'Refresh Token이 없습니다.');
        let decoded;
        try {
            decoded = (0, token_1.verifyRefreshToken)(refreshToken);
        }
        catch (_a) {
            throw new httpError_1.HttpError(401, 'Refresh Token이 유효하지 않습니다.');
        }
        const { accessToken, refreshToken: newRefreshToken } = (0, token_1.generateTokens)(decoded.id);
        return {
            cookies: [
                buildAccessCookie(accessToken),
                buildRefreshCookie(newRefreshToken),
            ],
            body: { message: '토큰 재발급 완료' },
        };
    });
}
function logoutService() {
    return {
        clearCookies: [
            constants_1.ACCESS_TOKEN_COOKIE_NAME,
            constants_1.REFRESH_TOKEN_COOKIE_NAME,
        ],
        body: { message: '로그아웃 완료' },
    };
}
function getMeService(user) {
    if (!user)
        throw new httpError_1.HttpError(401, '로그인이 필요합니다.');
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
}
function updateProfileService(user, dto) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = user.id;
        const { email, nickname, image } = dto;
        if (!email && !nickname && typeof image === 'undefined') {
            throw new httpError_1.HttpError(400, '변경할 값을 하나 이상 입력해주세요.');
        }
        if (email && email !== user.email) {
            const existedEmail = yield (0, authRepository_1.findUserByEmail)(email);
            if (existedEmail && existedEmail.id !== userId) {
                throw new httpError_1.HttpError(409, '이미 사용 중인 이메일입니다.');
            }
        }
        if (nickname && nickname !== user.nickname) {
            const existedNickname = yield (0, authRepository_1.findUserByNickname)(nickname);
            if (existedNickname && existedNickname.id !== userId) {
                throw new httpError_1.HttpError(409, '이미 사용 중인 닉네임입니다.');
            }
        }
        const updatedUser = yield (0, authRepository_1.updateUserById)(userId, Object.assign(Object.assign(Object.assign({}, (email && { email })), (nickname && { nickname })), (typeof image !== 'undefined' && { image })));
        const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
        return userWithoutPassword;
    });
}
function changePasswordService(userId, dto) {
    return __awaiter(this, void 0, void 0, function* () {
        const { currentPassword, newPassword } = dto;
        if (!currentPassword || !newPassword) {
            throw new httpError_1.HttpError(400, '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
        }
        const user = yield (0, authRepository_1.findUserById)(userId);
        if (!user)
            throw new httpError_1.HttpError(404, '사용자를 찾을 수 없습니다.');
        const isValid = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isValid)
            throw new httpError_1.HttpError(401, '현재 비밀번호가 올바르지 않습니다.');
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield (0, authRepository_1.updateUserById)(userId, { password: hashedPassword });
        return { message: '비밀번호가 변경되었습니다.' };
    });
}
