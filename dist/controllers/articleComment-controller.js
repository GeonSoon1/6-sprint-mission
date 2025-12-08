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
exports.createArticleComment = createArticleComment;
exports.getArticleCommentsList = getArticleCommentsList;
exports.updateArticleComment = updateArticleComment;
exports.deleteArticleComment = deleteArticleComment;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function createArticleComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // article이 DB에 있는지 확인
        const articleId = Number(req.params.articleId);
        const article = yield prismaclient_1.default.article.findUnique({ where: { id: articleId } });
        if (!article)
            return res.status(404).json({ message: 'Cannot found article' });
        // user가 DB에 존재 하는지 확인
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!findUser)
            return res.status(401).json({ message: 'Unauthorized' });
        const { content } = req.body;
        const commentCreate = yield prismaclient_1.default.commentArticle.create({
            data: {
                content,
                userId,
                articleId,
            },
            include: {
                article: true,
            },
        });
        res.status(201).json(commentCreate);
    });
}
function getArticleCommentsList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const articleId = Number(req.params.articleId);
        const article = yield prismaclient_1.default.article.findUnique({ where: { id: articleId } });
        if (!article)
            return res.status(404).json({ message: 'Cannot found article' });
        const articleComments = yield prismaclient_1.default.article.findUnique({
            where: { id: articleId },
            include: {
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!articleComments)
            return res.status(404).json({ message: 'Cannot found Article comment' });
        res.status(200).json(articleComments.comments);
    });
}
function updateArticleComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // article이 DB에 있는지 확인
        const articleId = Number(req.params.articleId);
        const article = yield prismaclient_1.default.article.findUnique({ where: { id: articleId } });
        if (!article)
            return res.status(404).json({ message: 'Cannot found article' });
        // user가 DB에 존재 하는지 확인
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!findUser)
            return res.status(401).json({ message: 'Unauthorized' });
        // comment가 DB에 존재 하는지 확인
        const commentId = Number(req.params.commentId);
        const comment = yield prismaclient_1.default.commentArticle.findUnique({
            where: { id: commentId },
        });
        if (!comment)
            return res.status(404).json({ message: 'Cannot found comment' });
        // DB에 있는 comment userID 정보와 로그인 한 User 정보가 같은지 확인
        if (comment.userId !== userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const commentUpdate = yield prismaclient_1.default.commentArticle.update({
            where: { id: commentId },
            data: req.body,
        });
        res.status(201).json(commentUpdate);
    });
}
function deleteArticleComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // article이 DB에 있는지 확인
        const articleId = Number(req.params.articleId);
        const article = yield prismaclient_1.default.article.findUnique({ where: { id: articleId } });
        if (!article)
            return res.status(404).json({ message: 'Cannot found article' });
        // user가 DB에 존재 하는지 확인
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!findUser)
            return res.status(401).json({ message: 'Unauthorized' });
        // comment가 DB에 존재 하는지 확인
        const commentId = Number(req.params.commentId);
        const comment = yield prismaclient_1.default.commentArticle.findUnique({
            where: { id: commentId },
        });
        if (!comment)
            return res.status(404).json({ message: 'Cannot found comment' });
        // DB에 있는 comment userID 정보와 로그인 한 User 정보가 같은지 확인
        if (comment.userId !== userId)
            return res.status(401).json({ message: 'Unauthorized' });
        yield prismaclient_1.default.commentArticle.delete({
            where: { id: commentId },
        });
        res.status(204).json({ message: '삭제 완료' });
    });
}
