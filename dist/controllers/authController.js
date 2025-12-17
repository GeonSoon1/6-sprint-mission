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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.getMe = getMe;
exports.updateProfile = updateProfile;
exports.changePassword = changePassword;
const authService_1 = require("../services/authService");
const httpError_1 = require("../lib/httpError");
const constants_1 = require("../lib/constants");
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const user = yield (0, authService_1.registerService)(body);
            return res.status(201).json(user);
        }
        catch (e) {
            next(e);
        }
    });
}
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const result = yield (0, authService_1.loginService)(body);
            for (const c of result.cookies) {
                res.cookie(c.name, c.value, c.options);
            }
            return res.status(200).json(result.body);
        }
        catch (e) {
            next(e);
        }
    });
}
function refresh(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[constants_1.REFRESH_TOKEN_COOKIE_NAME];
            const result = yield (0, authService_1.refreshService)(token);
            for (const c of result.cookies) {
                res.cookie(c.name, c.value, c.options);
            }
            return res.status(200).json(result.body);
        }
        catch (e) {
            next(e);
        }
    });
}
function logout(req, res) {
    const result = (0, authService_1.logoutService)();
    for (const name of result.clearCookies) {
        res.clearCookie(name);
    }
    return res.status(200).json(result.body);
}
function getMe(req, res, next) {
    try {
        const me = (0, authService_1.getMeService)(req.user);
        return res.status(200).json(me);
    }
    catch (e) {
        next(e);
    }
}
function updateProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user)
                throw new httpError_1.HttpError(401, '로그인이 필요합니다.');
            const body = req.body;
            const updated = yield (0, authService_1.updateProfileService)(req.user, body);
            return res.status(200).json(updated);
        }
        catch (e) {
            next(e);
        }
    });
}
function changePassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user)
                throw new httpError_1.HttpError(401, '로그인이 필요합니다.');
            const body = req.body;
            const result = yield (0, authService_1.changePasswordService)(req.user.id, body);
            return res.status(200).json(result);
        }
        catch (e) {
            next(e);
        }
    });
}
