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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserlikedProductsList = getUserlikedProductsList;
exports.getUserlikedArticlesList = getUserlikedArticlesList;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function getUserlikedProductsList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const productLikeDB = yield prismaclient_1.default.productLikes.findMany({
            where: { userId },
        });
        const productLikeIds = productLikeDB.map((item) => item.productId);
        let likeProductList = [];
        for (const id of productLikeIds) {
            const product = yield prismaclient_1.default.product.findUnique({
                where: { id },
            });
            likeProductList.push(product);
        }
        return res.status(200).json(likeProductList);
    });
}
function getUserlikedArticlesList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const articleLikeDB = yield prismaclient_1.default.articleLikes.findMany({
            where: { userId },
        });
        const articleLikeIds = articleLikeDB.map((item) => item.articleId);
        let likeArticleList = [];
        for (const id of articleLikeIds) {
            const article = yield prismaclient_1.default.article.findUnique({
                where: { id },
            });
            likeArticleList.push(article);
        }
        return res.status(200).json(likeArticleList);
    });
}
