import { Request, Response } from 'express';
import { CommentService } from '../services/commentService';
import {
  CommentCreateDto,
  CommentQueryDto,
  CommentUpdateDto,
} from '../dto/commentDto';
import { CommentRepository } from '../repogitories/commentRepogitory';
import { ArticleRepogitory } from '../repogitories/articleRepogitory';
import { NotificationRepository } from '../repogitories/notificationRepogitory';
import { NotificationService } from '../services/notificationService';

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
    const dto: CommentQueryDto = {
      productId: req.validatedProductId!.productId,
      ...Object.fromEntries(
        Object.entries(req.validatedCommentGetList!).filter(
          ([_, v]) => v !== undefined
        )
      ),
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
    const dto: CommentQueryDto = {
      articleId: req.validatedArticleId?.articleId,
      ...Object.fromEntries(
        Object.entries(req.validatedCommentGetList!).filter(
          ([_, v]) => v !== undefined
        )
      ),
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

const commentRepogitory = new CommentRepository();
const articleRepogitory = new ArticleRepogitory();
const notificationRepo = new NotificationRepository();
const notificationService = new NotificationService(notificationRepo);
const commentService = new CommentService(commentRepogitory, articleRepogitory, notificationService);
export const commentController = new CommentController(commentService);

