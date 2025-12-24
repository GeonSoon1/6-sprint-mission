"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePassword = exports.PatchProfile = exports.LoginUser = exports.RegisterUser = void 0;
const s = __importStar(require("superstruct"));
// 회원가입
exports.RegisterUser = s.object({
    email: s.string(),
    nickname: s.string(),
    password: s.string(), // 필요하면 최소 길이 체크는 나중에 커스텀으로
});
// 로그인
exports.LoginUser = s.object({
    email: s.string(),
    password: s.string(),
});
// 수정
exports.PatchProfile = s.partial(s.object({
    email: s.string(),
    nickname: s.string(),
    image: s.string(),
}));
// 비밀번호 변경
exports.ChangePassword = s.object({
    currentPassword: s.string(),
    newPassword: s.string(),
});
