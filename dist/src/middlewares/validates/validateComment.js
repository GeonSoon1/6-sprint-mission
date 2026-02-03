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
exports.getListCommentSchema = exports.updateCommentSchema = exports.createCommentSchema = void 0;
exports.validateCreateComment = validateCreateComment;
exports.validateUpdateComment = validateUpdateComment;
exports.validateGetListComment = validateGetListComment;
const s = __importStar(require("superstruct"));
const is_uuid_1 = __importDefault(require("is-uuid"));
const createCommentSchema = s.object({
    content: s.size(s.string(), 1, 500),
});
exports.createCommentSchema = createCommentSchema;
function validateCreateComment(req, res, next) {
    try {
        req.validatedCommentCreate = s.create(req.body, createCommentSchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
const updateCommentSchema = s.partial(createCommentSchema);
exports.updateCommentSchema = updateCommentSchema;
function validateUpdateComment(req, res, next) {
    try {
        req.validatedCommentUpdate = s.create(req.body, updateCommentSchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
const cursorSchema = s.refine(s.optional(s.coerce(s.string(), s.string(), (v) => (v === '' ? undefined : v))), 'UUID', (value) => value === undefined || is_uuid_1.default.v4(value));
const getListCommentSchema = s.object({
    cursor: cursorSchema,
    limit: s.optional(s.coerce(s.number(), s.string(), (v) => {
        const n = Number(v);
        return Number.isNaN(n) || n < 1 ? 1 : n;
    })),
});
exports.getListCommentSchema = getListCommentSchema;
function validateGetListComment(req, res, next) {
    try {
        req.validatedCommentGetList = s.create(req.query, getListCommentSchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
//# sourceMappingURL=validateComment.js.map