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
exports.getUserCreatedProductsList = getUserCreatedProductsList;
exports.getUserCreatedArticlesList = getUserCreatedArticlesList;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
//user가 생성한 product list 확인
function getUserCreatedProductsList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const { offset, limit, name, description, orderBy } = req.validated;
        const productList = yield prismaclient_1.default.product.findMany({
            where: {
                userId,
                name: { contains: name },
                description: { contains: description },
            },
            skip: offset,
            take: limit,
            orderBy,
        });
        if (!productList || productList.length === 0)
            return res
                .status(401)
                .json({ message: '사용자가 생성 한 제품 목록을 찾을 수 없습니다' });
        res.status(200).json(productList);
    });
}
//user가 생성한 article list 확인
function getUserCreatedArticlesList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const { offset, limit, title, content, orderBy } = req.validated;
        const articleList = yield prismaclient_1.default.article.findMany({
            where: {
                userId,
                title: { contains: title },
                content: { contains: content },
            },
            skip: offset,
            take: limit,
            orderBy,
        });
        if (!articleList || articleList.length === 0)
            return res
                .status(401)
                .json({ message: '사용자가 생성 한 게시글 목록을 찾을 수 없습니다' });
        res.status(200).json(articleList);
    });
}
