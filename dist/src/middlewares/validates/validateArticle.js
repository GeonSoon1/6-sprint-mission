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
exports.createArticleSchema = exports.updateArticleSchema = exports.getArticleQuerySchema = void 0;
exports.validateCreateArticle = validateCreateArticle;
exports.validateUpdateArticle = validateUpdateArticle;
exports.validateGetListArticle = validateGetListArticle;
const s = __importStar(require("superstruct"));
const createArticleSchema = s.object({
    title: s.size(s.string(), 1, 30),
    content: s.size(s.string(), 1, 500),
});
exports.createArticleSchema = createArticleSchema;
function validateCreateArticle(req, res, next) {
    try {
        req.validatedArticleCreate = s.create(req.body, createArticleSchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
const updateArticleSchema = s.partial(createArticleSchema);
exports.updateArticleSchema = updateArticleSchema;
function validateUpdateArticle(req, res, next) {
    try {
        req.validatedArticleUpdate = s.create(req.body, updateArticleSchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
const getArticleQuerySchema = s.object({
    page: s.optional(s.coerce(s.number(), s.string(), (v) => {
        const n = Number(v);
        return Number.isNaN(n) || n < 1 ? 1 : n; // NaN이거나 1보다 작으면 1 반환
    })),
    limit: s.optional(s.coerce(s.number(), s.string(), (v) => {
        const n = Number(v);
        return Number.isNaN(n) || n < 1 ? 1 : n;
    })),
    search: s.optional(s.size(s.string(), 0, 50)),
    skip: s.optional(s.coerce(s.number(), s.string(), (v) => {
        const n = Number(v);
        return Number.isNaN(n) || n < 1 ? 1 : n;
    })),
    sort: s.optional(s.union([s.enums(['recent', 'oldest']), s.literal('')])),
});
exports.getArticleQuerySchema = getArticleQuerySchema;
function validateGetListArticle(// req = 재할당
req, res, next) {
    try {
        req.validatedArticleQuery = s.create(req.query, getArticleQuerySchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
//# sourceMappingURL=validateArticle.js.map