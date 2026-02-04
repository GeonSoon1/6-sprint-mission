import { Request, Response } from 'express';
import { CommentService } from '../comments/comment.service';
import {
  CommentCreateDto,
  CommentQueryDto,
  CommentUpdateDto,
} from '../comments/comment.dto';
import { CommentRepository } from '../comments/comment.repository';
import { ArticleRepogitory } from '../articles/article.repository';
import { NotificationRepository } from '../notifications/notification.repository';
import { NotificationService } from '../notifications/notification.service';

export class CommentController {
  constructor(private service: CommentService) {}

  async createProductComment(req: Request, res: Response) {
    const dto: CommentCreateDto = {
      ...req.validatedCommentCreate!,
      productId: req.validatedProductId!.productId,
      userId: req.user!.id,
    };

    const data = await this.service.create(dto);
    res.status(201).json(data);
  }

  async getCommentsByProductId(req: Request, res: Response) {
    // validatedCommentGetList (limit) -> DTO (take) 매핑
    const { cursor, limit } = req.validatedCommentGetList as any;

    const dto: CommentQueryDto = {
      productId: req.validatedProductId!.productId,
      cursor,
      take: limit,
    };

    const data = await this.service.getCommentsByProduct(dto);
    res.status(200).json(data);
  }

  async createArticleComment(req: Request, res: Response) {
    const dto: CommentCreateDto = {
      ...req.validatedCommentCreate!,
      userId: req.user!.id,
      articleId: req.validatedArticleId?.articleId,
    };
    const data = await this.service.create(dto);
    res.status(201).json(data);
  }

  async getCommentsByArticle(req: Request, res: Response) {
    const { cursor, limit } = req.validatedCommentGetList as any;

    const dto: CommentQueryDto = {
      articleId: req.validatedArticleId?.articleId,
      cursor,
      take: limit,
    };
    const data = await this.service.getCommentsByArticle(dto);
    res.status(200).json(data);
  }

  async update(req: Request, res: Response) {
    const id = req.validatedId!.id;
    const dto: CommentUpdateDto = {
      content: req.validatedCommentUpdate!.content!,
      userId: req.user!.id,
    };
    const updated = await this.service.update(id, dto);
    res.status(200).json(updated);
  }

  async delete(req: Request, res: Response) {
    const id = req.validatedId!.id;
    await this.service.delete(id);
    res.status(204).json();
  }
}

const commentRepository = new CommentRepository();
const articleRepository = new ArticleRepogitory();
const notificationRepo = new NotificationRepository();
const notificationService = new NotificationService(notificationRepo);
const commentService = new CommentService(
  commentRepository,
  articleRepository,
  notificationService
);
export const commentController = new CommentController(commentService);
