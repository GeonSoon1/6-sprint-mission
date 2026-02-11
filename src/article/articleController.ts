import { articleService } from './articleService';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/structs';
import { ExpressHandler } from '../libs/constants';
import { CustomError } from '../libs/Handler/errorHandler';

export default class ArticleController {
    getArticles: ExpressHandler = async (req, res) => {
        const { offset = 0, limit = 0, order = 'newset', title = "", content = "" } = req.query;
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
        const parsedOffset = parseInt(offset as string, 10) || 0;
        const parsedLimit = parseInt(limit as string, 10) || 0;

        const findOptions: any = {
            where: {
                title: {
                    contains: title,
                },
                content: {
                    contains: content,
                },
            },
            orderBy,
            skip: parsedOffset,
        };

        if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
            findOptions.take = parsedLimit;
        }

        const userId = req.user ? req.user.userId : null;
        if (!userId) throw new CustomError(404, "UserId Not Found");
        const articles = await articleService.getArticles(findOptions, userId);
        res.send(articles);
    };

    getArticleById: ExpressHandler = async (req, res) => {
        const { id } = req.params;
        if (!id) throw new CustomError(404, "id Not Found");
        const _id = parseInt(id);
        const userId = req.user ? req.user.userId : null;
        if (!userId) throw new CustomError(404, "userId Not Found");
        const article = await articleService.getArticleById(_id, userId);
        res.send(article);
    };

    postArticle: ExpressHandler = async (req, res) => {
        assert(req.body, CreateArticle);
        const { ...userFields } = req.body;
        const userId = req.user?.userId;
        if (!userId) throw new CustomError(401, 'Unauthorized');
        const article = await articleService.postArticle({ ...userFields, userId });
        res.status(201).send(article);
    };

    patchArticleById: ExpressHandler = async (req, res) => {
        const { id } = req.params;
        if (!id) throw new CustomError(404, "id Not Found");
        const _id = parseInt(id);
        assert(req.body, PatchArticle);
        const { ...userFields } = req.body;
        const userId = req.user?.userId;
        if (!userId) throw new CustomError(401, 'Unauthorized');
        const article = await articleService.patchArticleById(_id, { ...userFields, userId });
        res.send(article);
    };

    deleteArticleById: ExpressHandler = async (req, res) => {
        const { id } = req.params;
        if (!id) throw new CustomError(404, "id Not Found");
        const _id = parseInt(id);
        const userId = req.user?.userId;
        if (!userId) throw new CustomError(401, 'Unauthorized');
        const article = await articleService.deleteArticleById(_id, userId);
        res.send(article);
    };

    likeArticle: ExpressHandler = async (req, res) => {
        if (!req.user) throw new CustomError(404, "user Not Found");
        const userId = req.user.userId;
        const articleId = req.params.id;
        if (!articleId) throw new CustomError(404, "articleId Not Found");
        const _articleId = parseInt(articleId);
        const result = await articleService.likeArticle(userId, _articleId);
        return res.status(200).json(result);
    };
}
