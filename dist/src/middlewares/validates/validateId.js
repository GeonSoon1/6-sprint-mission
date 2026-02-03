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
exports.validateNotificationIdParam = exports.validateArticleIdParam = exports.validateProductIdParam = exports.validateIdParam = exports.validateNotificationId = exports.validateArticleId = exports.validateProductId = exports.validateId = void 0;
const s = __importStar(require("superstruct"));
const is_uuid_1 = __importDefault(require("is-uuid"));
exports.validateId = s.object({
    id: s.define('UUID', (value) => {
        // value 파라미터 unknown 주고 string이 아닐 경우 false 맞을 경우 검사를 직접 지정해줌
        if (typeof value !== 'string')
            return false;
        return is_uuid_1.default.v4(value);
    }),
});
exports.validateProductId = s.object({
    productId: s.define('UUID', (value) => {
        if (typeof value !== 'string')
            return false;
        return is_uuid_1.default.v4(value);
    }),
});
exports.validateArticleId = s.object({
    articleId: s.define('UUID', (value) => {
        if (typeof value !== 'string')
            return false;
        return is_uuid_1.default.v4(value);
    }),
});
exports.validateNotificationId = s.object({
    notificationId: s.define('UUID', (value) => {
        if (typeof value !== 'string')
            return false;
        return is_uuid_1.default.v4(value);
    }),
});
const validateIdParam = (req, res, next) => {
    try {
        req.validatedId = s.create(req.params, exports.validateId);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
};
exports.validateIdParam = validateIdParam;
const validateProductIdParam = (req, res, next) => {
    try {
        req.validatedProductId = s.create(req.params, exports.validateProductId);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
};
exports.validateProductIdParam = validateProductIdParam;
const validateArticleIdParam = (req, res, next) => {
    try {
        req.validatedArticleId = s.create(req.params, exports.validateArticleId);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
};
exports.validateArticleIdParam = validateArticleIdParam;
const validateNotificationIdParam = (req, res, next) => {
    try {
        req.validatedNotificationId = s.create(req.params, exports.validateNotificationId);
        next();
    }
    catch (e) {
        if (e instanceof s.StructError)
            return next(e);
        next(e);
    }
};
exports.validateNotificationIdParam = validateNotificationIdParam;
//# sourceMappingURL=validateId.js.map