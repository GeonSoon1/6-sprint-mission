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
        var _a, _b, _c, _d, _e;
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        // user 검증
        const user = yield prismaclient_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        // 리스트 검색 조건
        const name = String((_a = req.query.name) !== null && _a !== void 0 ? _a : '');
        const description = String((_b = req.query.description) !== null && _b !== void 0 ? _b : '');
        const limit = Number((_c = req.query.limit) !== null && _c !== void 0 ? _c : 10);
        const offset = Number((_d = req.query.offset) !== null && _d !== void 0 ? _d : 0);
        const sort = String((_e = req.query.sort) !== null && _e !== void 0 ? _e : 'newest');
        let orderBy;
        switch (sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }
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
            return res.status(401).json({ message: 'cannot find list' });
        res.status(200).json(productList);
    });
}
//user가 생성한 article list 확인
function getUserCreatedArticlesList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        // user 검증
        const user = yield prismaclient_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        // 리스트 검색 조건
        const title = String((_a = req.query.name) !== null && _a !== void 0 ? _a : '');
        const content = String((_b = req.query.description) !== null && _b !== void 0 ? _b : '');
        const limit = Number((_c = req.query.limit) !== null && _c !== void 0 ? _c : 10);
        const offset = Number((_d = req.query.offset) !== null && _d !== void 0 ? _d : 0);
        const sort = String((_e = req.query.sort) !== null && _e !== void 0 ? _e : 'newest');
        let orderBy;
        switch (sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }
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
            return res.status(401).json({ message: 'cannot find list' });
        res.status(200).json(articleList);
    });
}
