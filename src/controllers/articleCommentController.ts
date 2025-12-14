import { Request, Response } from 'express';
import { ArticleCommentService } from '../services/articleCommentService';

export class ArticleCommentController {
  constructor(private articleCommentService: ArticleCommentService) {}

  public createComment = async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const authorId = req.user!.id;
    const content = req.body;

    const newComment = await this.articleCommentService.createComment(
      articleId,
      authorId,
      content,
    );
    res.status(201).json(newComment);
  };

  public getCommentsByArticleId = async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const content = await this.articleCommentService.getComments(articleId);
    res.status(200).json(content);
  };

  public updateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user!.id;
    const content = req.body;

    const updateComment = await this.articleCommentService.updateComment(
      commentId,
      authorId,
      content,
    );
    res.status(200).json(updateComment);
  };

  public deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user!.id;

    await this.articleCommentService.deleteComment(commentId, authorId);
    res.status(204).send();
  };
}
