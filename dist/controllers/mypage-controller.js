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
exports.userInfo = userInfo;
exports.updateUserInfo = updateUserInfo;
exports.updatePassword = updatePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function userInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const user = yield prismaclient_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        const { password: _ } = user, userInfo = __rest(user, ["password"]);
        res.status(200).json(userInfo);
    });
}
function updateUserInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const _a = req.body, { email, nickname, image } = _a, secret = __rest(_a, ["email", "nickname", "image"]);
        // 변경 가능한 정보를 제외 한 나머지 정보는 secret에 담아둠
        if (email)
            return res.status(400).json({ message: 'Cannot updete email' });
        // user 검증
        const user = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        const updateUser = yield prismaclient_1.default.user.update({
            where: { id: userId },
            data: {
                nickname,
                image,
            },
        });
        const { password: _ } = updateUser, updateUserInfo = __rest(updateUser, ["password"]);
        res.status(200).json(updateUserInfo);
    });
}
function updatePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        // user 검증
        const user = yield prismaclient_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        // 사용자가 입력한 패스워드 정보 받음
        const { password, newPassword, checkNewPassword } = req.body;
        // password가 기존과 동일한지 확인
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ message: 'password Recheck please!' });
        // 신규 입력한 비밀번호와 확인용 비밀번호가 동일한지 확인
        if (!(newPassword === checkNewPassword))
            return res.status(401).json({ message: 'new password Recheck please!' });
        // 신규로 입력 한 비밀번호 저장
        const salt = yield bcrypt_1.default.genSalt();
        const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, salt);
        const updateHashedPassword = yield prismaclient_1.default.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        res.status(200).json({ message: 'change password!' });
    });
}
