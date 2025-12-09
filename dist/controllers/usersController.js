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
exports.userRegister = userRegister;
exports.userLogin = userLogin;
exports.refreshTokens = refreshTokens;
exports.userLogout = userLogout;
exports.userInfo = userInfo;
exports.userInfoPatch = userInfoPatch;
exports.userUploadProducts = userUploadProducts;
exports.userList = userList;
const superstruct_1 = require("superstruct");
const prismaClient_1 = require("../lib/prismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usersStructs_1 = require("../structs/usersStructs");
const token_1 = require("../lib/token");
const constants_1 = require("../lib/constants");
const UnauthorizeError_1 = __importDefault(require("../lib/errors/UnauthorizeError"));
/*-------회원 가입 및 로그인 로그아웃 , 토큰 관련 컨트롤러------*/
function userRegister(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const data = (0, superstruct_1.create)(Object.assign(Object.assign({}, rest), { password: hashedPassword }), usersStructs_1.CreateUserBodyStruct);
        const user = yield prismaClient_1.prismaClient.user.create({ data });
        return res.status(201).send(user);
    });
}
function userLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nickname, password } = req.body;
        const user = yield prismaClient_1.prismaClient.user.findUnique({ where: { nickname } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = (0, token_1.generateTokens)(user.id);
        setTokenCookies(res, accessToken, refreshToken);
        return res.status(200).send({ message: 'login success' });
    });
}
function refreshTokens(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = req.cookies[constants_1.REFRESH_TOKEN_COOKIE_NAME];
        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { userId } = (0, token_1.verifyRefreshToken)(refreshToken);
        const user = yield prismaClient_1.prismaClient.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { accessToken, refreshToken: newRefreshToken } = (0, token_1.generateTokens)(user.id);
        setTokenCookies(res, accessToken, newRefreshToken);
        return res.status(200).send();
    });
}
function userLogout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        clearTokenCookies(res);
        return res.status(200).send({ message: 'logout success' });
    });
}
function setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(constants_1.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: constants_1.NODE_ENV === 'production',
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });
    res.cookie(constants_1.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: constants_1.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/auth/refresh',
    });
}
function clearTokenCookies(res) {
    res.clearCookie(constants_1.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(constants_1.REFRESH_TOKEN_COOKIE_NAME);
}
/*------유저 개인 정보 확인 및 수정 삭제 컨트롤러*/
function userInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        const userData = yield prismaClient_1.prismaClient.user.findUnique({
            select: {
                email: true,
                nickname: true,
                image: true,
                createdAt: true,
                likeProducts: {
                    select: {
                        product: {
                            select: {
                                name: true,
                                description: true,
                                price: true,
                                tags: true,
                                images: true,
                            },
                        },
                    },
                },
            },
            where: { id: user.id },
        });
        return res.status(200).send(userData);
    });
}
function userInfoPatch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        if (password) {
            console.log('cna not change password');
        }
        const updateUser = yield prismaClient_1.prismaClient.user.update({
            where: { id: user.id },
            data: rest,
            select: {
                email: true,
                nickname: true,
                image: true,
            },
        });
        return res.status(200).send({ message: 'updated userInfo', updateUser });
    });
}
function userUploadProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        const uploadProduct = yield prismaClient_1.prismaClient.user.findMany({
            select: {
                products: {
                    select: {
                        name: true,
                        description: true,
                        price: true,
                        tags: true,
                        images: true,
                    },
                },
            },
            where: { id: user.id },
        });
        return res.status(200).send({ message: 'uploaded user product sent', uploadProduct });
    });
}
//------유저 리스트 확인용 디버깅 코드
function userList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userList = yield prismaClient_1.prismaClient.user.findMany();
        return res.status(200).send(userList);
    });
}
