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
exports.getProductQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
exports.validateCreateProduct = validateCreateProduct;
exports.validateGetListProduct = validateGetListProduct;
exports.validateUpdateProduct = validateUpdateProduct;
const s = __importStar(require("superstruct"));
const createProductSchema = s.object({
    name: s.size(s.string(), 1, 30),
    description: s.size(s.string(), 1, 500),
    price: s.number(),
    tags: s.array(s.string()),
});
exports.createProductSchema = createProductSchema;
function validateCreateProduct(req, res, next) {
    try {
        req.validatedProductCreate = s.create(req.body, createProductSchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
const updateProductSchema = s.partial(createProductSchema);
exports.updateProductSchema = updateProductSchema;
function validateUpdateProduct(req, res, next) {
    try {
        req.validatedProductUpdate = s.create(req.body, updateProductSchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
const getProductQuerySchema = s.object({
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
exports.getProductQuerySchema = getProductQuerySchema;
function validateGetListProduct(req, res, next) {
    try {
        req.validatedProductQuery = s.create(req.query, getProductQuerySchema);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
}
//# sourceMappingURL=validateProduct.js.map