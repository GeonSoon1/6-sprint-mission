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
exports.default = authenticate;
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
const token_1 = require("../lib/token");
const constants_1 = require("../lib/constants");
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[constants_1.ACCESS_TOKEN_COOKIE_NAME];
        if (!token) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }
        try {
            const decoded = (0, token_1.verifyAccessToken)(token);
            const userId = String(decoded.id);
            if (!userId) {
                return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
            }
            const user = yield prismaClient_1.default.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(401).json({ message: '유효하지 않은 사용자입니다.' });
            }
            req.user = user;
            next();
        }
        catch (err) {
            return res
                .status(401)
                .json({ message: '토큰이 만료되었거나 잘못되었습니다.' });
        }
    });
}
