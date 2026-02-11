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
exports.updateUserProfileSchema = exports.loginUserSchema = exports.createUserSchema = void 0;
exports.validateCreateUser = validateCreateUser;
exports.validateLoginUser = validateLoginUser;
exports.validateUpdateUser = validateUpdateUser;
const s = __importStar(require("superstruct"));
// 유저 회원 가입 유효성 스키마
const createUserSchema = s.object({
    email: s.pattern(s.string(), /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    nickname: s.size(s.nonempty(s.string()), 1, 30),
    password: s.size(s.nonempty(s.string()), 8, 20),
});
exports.createUserSchema = createUserSchema;
async function validateCreateUser(req, res, next) {
    try {
        req.validatedUserCreate = s.create(req.body, createUserSchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
// 로그인 유효성 스키마
const loginUserSchema = s.object({
    email: s.size(s.nonempty(s.string()), 1, 100),
    password: s.size(s.nonempty(s.string()), 8, 20),
});
exports.loginUserSchema = loginUserSchema;
async function validateLoginUser(req, res, next) {
    try {
        req.validatedUserLogin = s.create(req.body, loginUserSchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
// 유저 프로필 수정 (비밀번호 필수)
const updateUserProfileSchema = s.object({
    nickname: s.optional(s.size(s.nonempty(s.string()), 1, 30)),
    image: s.optional(s.size(s.nonempty(s.string()), 0, 100)),
    password: s.size(s.nonempty(s.string()), 8, 20),
    newPassword: s.optional(s.size(s.nonempty(s.string()), 8, 20)),
});
exports.updateUserProfileSchema = updateUserProfileSchema;
async function validateUpdateUser(req, res, next) {
    try {
        req.validatedUserUpdate = s.create(req.body, updateUserProfileSchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
//# sourceMappingURL=validateUser.js.map