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
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
const constants_1 = require("../lib/constants");
const token_1 = require("../lib/token");
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // 쿠키 안에 Access Token이 있는지 확인
        const isAccessToken = req.cookies[constants_1.ACCESS_TOKEN_COOKIE_NAME];
        if (!isAccessToken)
            return res.status(401).json({ message: 'Cannot found AccessToken' });
        // 쿠키 안에 Access Token이 있다면, 사용자 정보 가져오기
        try {
            const { userId } = (0, token_1.verifyAccessToken)(isAccessToken);
            const user = yield prismaclient_1.default.user.findUnique({
                where: { id: Number(userId) },
            });
            if (!user)
                return res.status(400).json({ message: 'Cannot found User' });
            req.user = user;
        }
        catch (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // 다음 비지니스 로직 실행하기
        next();
    });
}
