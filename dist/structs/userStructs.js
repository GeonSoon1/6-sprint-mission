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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUser = exports.CreateUser = void 0;
const s = __importStar(require("superstruct"));
const is_email_1 = __importDefault(require("is-email"));
// s.define이 원하는 함수 형식으로 emailValidator로 재구성
// 타입스크립트에서는 미리 선언한 형식에 맞춰 값을 작성해야 하므로
// 정확한 값을 표현하기 위한 추가 함수가 필요 해 졌음
const emailValidator = (value) => typeof value === 'string' && (0, is_email_1.default)(value);
exports.CreateUser = s.object({
    email: s.define('email', emailValidator),
    nickname: s.size(s.string(), 1, 30),
    password: s.size(s.string(), 8, 20),
});
exports.UpdateUser = s.object({
    nickname: s.size(s.string(), 1, 30),
});
