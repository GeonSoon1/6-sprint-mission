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
exports.productService = void 0;
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
const productLikeRepository_1 = __importDefault(require("../repositories/productLikeRepository"));
class ProductService {
    likeProduct(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLike = yield productLikeRepository_1.default.find(userId, productId);
            if (existingLike) {
                yield productLikeRepository_1.default.remove(existingLike.id);
                return { liked: false };
            }
            else {
                yield productLikeRepository_1.default.create(userId, productId);
                return { liked: true };
            }
        });
    }
    getProductById(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield productRepository_1.default.findById(productId, userId);
            const { productLikes } = product, rest = __rest(product, ["productLikes"]);
            return Object.assign(Object.assign({}, rest), { isLiked: productLikes.length > 0 });
        });
    }
    getProducts(findOptions, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield productRepository_1.default.findAll(findOptions, userId);
            return products.map((product) => {
                const { productLikes } = product, rest = __rest(product, ["productLikes"]);
                return Object.assign(Object.assign({}, rest), { isLiked: productLikes.length > 0 });
            });
        });
    }
}
exports.productService = new ProductService();
//# sourceMappingURL=productService.js.map