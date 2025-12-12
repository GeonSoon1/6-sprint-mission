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
exports.userCreateValidation = userCreateValidation;
exports.userUpdateValidation = userUpdateValidation;
exports.userUpdatePasswordValidation = userUpdatePasswordValidation;
const superstruct_1 = require("superstruct");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userStructs_1 = require("../structs/userStructs");
function userCreateValidation(req, res, next) {
    try {
        (0, superstruct_1.assert)(req.body, userStructs_1.CreateUser);
        next();
    }
    catch (err) {
        next(err);
    }
}
function userUpdateValidation(req, res, next) {
    try {
        const _a = req.body, { email } = _a, others = __rest(_a, ["email"]);
        if (email)
            return res.status(400).json({ message: '이메일은 변경 할 수 없습니다' });
        (0, superstruct_1.assert)(req.body, userStructs_1.UpdateUser);
        next();
    }
    catch (err) {
        next(err);
    }
}
function userUpdatePasswordValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            // password가 기존과 동일한지 확인
            const { password, newPassword, checkNewPassword } = req.body;
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid)
                return res.status(401).json({ message: '기존 패스워드를 확인 바랍니다' });
            // 신규 입력한 비밀번호와 확인용 비밀번호가 동일한지 확인
            if (!(newPassword === checkNewPassword))
                return res
                    .status(401)
                    .json({ message: '신규 비밀번호와 신규확인 비밀번호가 다릅니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
