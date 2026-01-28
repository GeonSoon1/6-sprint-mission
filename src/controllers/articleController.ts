import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { CreateArticleDTO } from '@dto';
import { ArticleService } from '@services';
import { TYPES } from '@types';

@injectable()
export class ArticleController {
  constructor(
    @inject(TYPES.ArticleService)
    private readonly articleService: ArticleService,
  ) {}

  /**
   * 게시글 생성
   */
  createArticle = async (req: Request, res: Response) => {
    const articleData: CreateArticleDTO = req.body;
    const userId = req.user!.id;

    const article = await this.articleService.createArticle(userId, articleData);
    res.status(201).json(article);
  };

  /**
   * 게시글 목록
   */
  getArticles = async (req: Request, res: Response) => {
    const { skip, take } = (req as any).pagination;
    const articles = await this.articleService.findArticles({ skip, take });
    res.status(200).json(articles);
  };

  /**
   * 게시글 상세
   */
  getArticleById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const article = await this.articleService.findArticleById(id);
    res.status(200).json(article);
  };

  /**
   * 게시글 수정
   */
  updateArticle = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user!.id;

    const newArticle = await this.articleService.updateArticle(id, userId, data);
    res.status(200).json(newArticle);
  };

  /**
   * 게시글 삭제
   */
  deleteArticle = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    await this.articleService.deleteArticle(id, userId);
    res.status(204).send();
  };
}
