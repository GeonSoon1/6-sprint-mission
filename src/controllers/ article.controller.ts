import { Request, Response, NextFunction } from 'express';
import { ArticleService } from '../services/article.service';

export class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  createArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const article = await this.articleService.createArticle(userId, req.body);
      res.status(201).json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  };

  getArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;
      const article = await this.articleService.getArticle(id, userId);
      res.status(200).json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  };

  getArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const keyword = req.query.keyword as string;
      const orderBy = req.query.orderBy as string;

      const result = await this.articleService.getArticles(page, limit, keyword, orderBy);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      const article = await this.articleService.updateArticle(id, userId, req.body);
      res.status(200).json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      await this.articleService.deleteArticle(id, userId);
      res.status(200).json({
        success: true,
        message: '게시글이 삭제되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  toggleLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const articleId = parseInt(req.params.id);
      const userId = req.user!.id;
      const result = await this.articleService.toggleLike(userId, articleId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
