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
exports.ChangePassword = exports.PatchUser = exports.CreateUser = void 0;
const s = __importStar(require("superstruct"));
const is_email_1 = __importDefault(require("is-email"));
const email = s.refine(s.string(), 'is_email', (v) => (0, is_email_1.default)(v));
exports.CreateUser = s.object({
    email: email,
    nickname: s.string(),
    image: s.optional(s.string()),
    password: s.string(),
});
exports.PatchUser = s.partial(s.object({
    email: email,
    nickname: s.string(),
    image: s.optional(s.string()),
}));
exports.ChangePassword = s.object({
    currentPassword: s.string(),
    newPassword: s.string(),
    confirmNewPassword: s.string(),
});
//# sourceMappingURL=userStructs.js.map