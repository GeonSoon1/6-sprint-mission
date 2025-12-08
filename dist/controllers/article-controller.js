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
exports.createArticle = createArticle;
exports.getArticlesList = getArticlesList;
exports.getArticleInfo = getArticleInfo;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function createArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // user가 DB에 존재 하는지 확인
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!findUser)
            return res.status(401).json({ message: 'Unauthorized' });
        // article 저장하기
        const { title, content } = req.body;
        const articleCreate = yield prismaclient_1.default.article.create({
            data: {
                title,
                content,
                userId,
            },
        });
        res.status(201).json(articleCreate);
    });
}
function getArticlesList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const offset = Number((_a = req.query.offset) !== null && _a !== void 0 ? _a : 0);
        const limit = Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 10);
        const title = String((_c = req.query.name) !== null && _c !== void 0 ? _c : '');
        const content = String((_d = req.query.description) !== null && _d !== void 0 ? _d : '');
        const order = String((_e = req.query.order) !== null && _e !== void 0 ? _e : 'newest');
        let orderBy;
        switch (order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }
        const articles = yield prismaclient_1.default.article.findMany({
            where: {
                title: {
                    contains: title,
                },
                content: {
                    contains: content,
                },
            },
            skip: offset,
            take: limit,
            orderBy,
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });
        if (!articles)
            return res.status(401).json({ message: 'Cannot found List' });
        res.status(200).json(articles);
    });
}
function getArticleInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        const article = yield prismaclient_1.default.article.findUniqueOrThrow({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });
        if (!article)
            return res.status(401).json({ message: `Cannot found ${id}` });
        // 현재 User가 좋아요 했는지 확인하기
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const checkLiked = yield prismaclient_1.default.articleLikes.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId: id,
                },
            },
        });
        let isLiked = false;
        if (checkLiked) {
            isLiked = true;
        }
        res.status(200).json({ article, isLiked });
    });
}
function updateArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const articleId = Number(req.params.id);
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        // article이 DB에 있는지 확인
        const article = yield prismaclient_1.default.article.findUnique({ where: { id: articleId } });
        if (!article)
            return res.status(401).json({ message: 'Cannot found article' });
        // User가 DB에 존재 하는지 확인
        const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!findUser)
            return res.status(401).json({ message: 'Unauthorized' });
        // DB에 있는 article userID 정보와 로그인 한 User 정보가 같은지 확인
        if (article.userId !== userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const articleUpdate = yield prismaclient_1.default.article.update({
            where: { id: articleId },
            data: req.body,
        });
        res.status(200).json(articleUpdate);
    });
}
function deleteArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const articleId = Number(req.params.id);
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        // Article이 DB에 있는지 확인
        const article = yield prismaclient_1.default.article.findUnique({ where: { id: articleId } });
        if (!article)
            return res.status(401).json({ message: 'Cannot found article' });
        // User가 DB에 존재 하는지 확인
        const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!findUser)
            return res.status(401).json({ message: 'Unauthorized' });
        // DB에 있는 article userID 정보와 로그인 한 User 정보가 같은지 확인
        if (article.userId !== userId)
            return res.status(401).json({ message: 'Unauthorized' });
        yield prismaclient_1.default.article.delete({
            where: { id: articleId },
        });
        res.status(204).json({ message: '삭제 완료' });
    });
}
