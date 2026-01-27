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
exports.PatchComment = exports.PatchArticle = exports.PatchProduct = exports.CreateComment = exports.CreateArticle = exports.CreateProduct = void 0;
const s = __importStar(require("superstruct"));
exports.CreateProduct = s.object({
    name: s.size(s.string(), 1, 100),
    description: s.string(),
    price: s.min(s.number(), 0),
    tags: s.array(s.string()),
});
exports.CreateArticle = s.object({
    title: s.size(s.string(), 1, 100),
    content: s.string(),
});
exports.CreateComment = s.refine(s.object({
    content: s.string(),
    productId: s.optional(s.number()),
    articleId: s.optional(s.number()),
}), 'EitherProductIdOrArticleId', //검증 규칙 이름
(value) => {
    const { productId, articleId } = value;
    // 실패 케이스: (둘 다 있거나) OR (둘 다 없거나)
    if ((productId && articleId) || (!productId && !articleId)) {
        return 'Comment must have *either* a productId *or* an articleId, but not both.';
    }
    // 성공 케이스: 둘 중 하나만 존재함
    return true;
});
exports.PatchProduct = s.partial(exports.CreateProduct);
exports.PatchArticle = s.partial(exports.CreateArticle);
exports.PatchComment = s.object({ content: s.optional(s.string()), });
//# sourceMappingURL=structs.js.map