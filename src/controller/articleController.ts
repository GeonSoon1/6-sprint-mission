import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/articleStructs';
import { AuthenticatedRequest } from '../types/auth';
import articleService from '../service/articleService';

class ArticleController {
  async getArticles(req: Request, res: Response) {
    const offset = String(req.query.offset ?? '0');
    const limit = String(req.query.limit ?? '10');
    const order = String(req.query.order ?? 'newest');
    const search = String(req.query.search ?? '');

    const articles = await articleService.getArticles({
      offset,
      limit,
      order,
      search,
    });

    res.send(articles);
  }

  async createArticle(req: AuthenticatedRequest, res: Response) {
    assert(req.body, CreateArticle);

    const article = await articleService.createArticle({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).send(article);
  }

  async getArticleById(req: Request, res: Response) {
    const articleId = Number(req.params.id);
    const article = await articleService.getArticleById(articleId);
    res.send(article);
  }

  async updateArticle(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    assert(req.body, PatchArticle);

    const articleId = Number(req.params.id);
    const updated = await articleService.updateArticle(articleId, req.body, req.user.id);

    res.send(updated);
  }

  async deleteArticle(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    const articleId = Number(req.params.id);

    await articleService.deleteArticle(articleId, req.user.id);
    res.sendStatus(204);
  }
}

export default new ArticleController();
