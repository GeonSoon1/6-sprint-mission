"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentController = exports.CommentController = void 0;
const comment_service_1 = require("../comments/comment.service");
const comment_repository_1 = require("../comments/comment.repository");
const article_repository_1 = require("../articles/article.repository");
const notification_repository_1 = require("../notifications/notification.repository");
const notification_service_1 = require("../notifications/notification.service");
class CommentController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createProductComment(req, res) {
        const dto = {
            ...req.validatedCommentCreate,
            productId: req.validatedProductId.productId,
            userId: req.user.id,
        };
        const data = await this.service.create(dto);
        res.status(201).json(data);
    }
    async getCommentsByProductId(req, res) {
        // validatedCommentGetList (limit) -> DTO (take) 매핑
        const { cursor, limit } = req.validatedCommentGetList;
        const dto = {
            productId: req.validatedProductId.productId,
            cursor,
            take: limit,
        };
        const data = await this.service.getCommentsByProduct(dto);
        res.status(200).json(data);
    }
    async createArticleComment(req, res) {
        const dto = {
            ...req.validatedCommentCreate,
            userId: req.user.id,
            articleId: req.validatedArticleId?.articleId,
        };
        const data = await this.service.create(dto);
        res.status(201).json(data);
    }
    async getCommentsByArticle(req, res) {
        const { cursor, limit } = req.validatedCommentGetList;
        const dto = {
            articleId: req.validatedArticleId?.articleId,
            cursor,
            take: limit,
        };
        const data = await this.service.getCommentsByArticle(dto);
        res.status(200).json(data);
    }
    async update(req, res) {
        const id = req.validatedId.id;
        const dto = {
            content: req.validatedCommentUpdate.content,
            userId: req.user.id,
        };
        const updated = await this.service.update(id, dto);
        res.status(200).json(updated);
    }
    async delete(req, res) {
        const id = req.validatedId.id;
        await this.service.delete(id);
        res.status(204).json();
    }
}
exports.CommentController = CommentController;
const commentRepository = new comment_repository_1.CommentRepository();
const articleRepository = new article_repository_1.ArticleRepogitory();
const notificationRepo = new notification_repository_1.NotificationRepository();
const notificationService = new notification_service_1.NotificationService(notificationRepo);
const commentService = new comment_service_1.CommentService(commentRepository, articleRepository, notificationService);
exports.commentController = new CommentController(commentService);
//# sourceMappingURL=comment.controller.js.map