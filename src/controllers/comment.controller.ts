import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service";

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  // Product Comments
  createProductComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const productId = parseInt(req.params.productId);
      const comment = await this.commentService.createProductComment(
        userId,
        productId,
        req.body
      );
      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  getProductComments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const productId = parseInt(req.params.productId);
      const cursor = req.query.cursor
        ? parseInt(req.query.cursor as string)
        : undefined;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.commentService.getProductComments(
        productId,
        cursor,
        limit
      );
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProductComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      const comment = await this.commentService.updateProductComment(
        id,
        userId,
        req.body
      );
      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProductComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      await this.commentService.deleteProductComment(id, userId);
      res.status(200).json({
        success: true,
        message: "댓글이 삭제되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  // Article Comments
  createArticleComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const articleId = parseInt(req.params.articleId);
      const comment = await this.commentService.createArticleComment(
        userId,
        articleId,
        req.body
      );
      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  getArticleComments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const articleId = parseInt(req.params.articleId);
      const cursor = req.query.cursor
        ? parseInt(req.query.cursor as string)
        : undefined;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.commentService.getArticleComments(
        articleId,
        cursor,
        limit
      );
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateArticleComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      const comment = await this.commentService.updateArticleComment(
        id,
        userId,
        req.body
      );
      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteArticleComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      await this.commentService.deleteArticleComment(id, userId);
      res.status(200).json({
        success: true,
        message: "댓글이 삭제되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}
