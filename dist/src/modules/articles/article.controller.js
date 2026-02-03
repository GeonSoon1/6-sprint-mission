"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleController = exports.ArticleController = void 0;
const article_service_1 = require("../articles/article.service");
const article_repository_1 = require("../articles/article.repository");
class ArticleController {
    service;
    constructor(service) {
        this.service = service;
    }
    // 게시글 생성
    async create(req, res) {
        const dto = {
            ...req.validatedArticleCreate,
            userId: req.user.id,
        };
        const data = await this.service.create(dto);
        res.status(201).json(data);
    }
    // 게시글 목록 조회
    async getArticles(req, res) {
        const dto = {
            page: req.validatedArticleQuery.page || 1,
            limit: req.validatedArticleQuery.limit || 10,
            search: req.validatedArticleQuery.search || '',
            sort: req.validatedArticleQuery.sort || 'recent',
            userId: req.auth?.userId ?? null,
        };
        const data = await this.service.getArticles(dto);
        res.status(200).json(data);
    }
    // 게시글 상세 조회
    async getById(req, res) {
        const id = req.validatedId.id;
        const userId = req.auth?.userId ?? null;
        const data = await this.service.getById(id, userId);
        res.status(200).json(data);
    }
    // 게시글 수정
    async update(req, res) {
        const id = req.validatedId.id;
        const dto = {
            ...Object.fromEntries(Object.entries(req.validatedArticleUpdate).filter(([_, v]) => v !== undefined)),
            userId: req.user.id,
        };
        const updated = await this.service.update(id, dto);
        res.status(200).json(updated);
    }
    // 게시글 삭제
    async delete(req, res) {
        const id = req.validatedId.id;
        await this.service.delete(id);
        res.status(204).send();
    }
}
exports.ArticleController = ArticleController;
// router에서 사용할 수 있도록 조립
const articleRepository = new article_repository_1.ArticleRepogitory();
const articleService = new article_service_1.ArticleService(articleRepository);
exports.articleController = new ArticleController(articleService);
//# sourceMappingURL=article.controller.js.map