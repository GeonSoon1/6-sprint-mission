import { Request, Response } from 'express';
import { ArticleService } from '../services/articleService';
import { ArticleCreateDto, ArticleQueryDto } from '../dto/articleDto';
import { ArticleRepogitory } from '../repogitories/articleRepogitory';

export class ArticleController {
  constructor(private service: ArticleService) {}
  // 게시글 생성
  async create(req: Request, res: Response) {
    const dto: ArticleCreateDto = {
      ...req.validatedArticleCreate!,
      userId: req.user!.id,
    };
    const data = await this.service.create(dto);
    res.status(201).json(data);
  }
  // 게시글 목록 조회
  async getArticles(req: Request, res: Response) {
    const dto: ArticleQueryDto = {
      page: req.validatedArticleQuery!.page || 1,
      limit: req.validatedArticleQuery!.limit || 10,
      search: req.validatedArticleQuery!.search || '',
      sort: req.validatedArticleQuery!.sort || 'recent',
      userId: req.auth?.userId ?? null,
    };

    const data = await this.service.getArticles(dto);
    res.status(200).json(data);
  }
  // 게시글 상세 조회
  async getById(req: Request, res: Response) {
    const id = req.validatedId!.id;
    const userId = req.auth?.userId ?? null;

    const data = await this.service.getById(id, userId);
    res.status(200).json(data);
  }

  // 게시글 수정
  async update(req: Request, res: Response) {
    const id = req.validatedId!.id;
    const dto = {
      ...Object.fromEntries(
        Object.entries(req.validatedArticleUpdate!).filter(
          ([_, v]) => v !== undefined
        )
      ),
      userId: req.user!.id,
    };
    const updated = await this.service.update(id, dto);
    res.status(200).json(updated);
  }

  // 게시글 삭제
  async delete(req: Request, res: Response) {
    const id = req.validatedId!.id;
    await this.service.delete(id);
    res.status(204).json({ message: '게시글 삭제 완료' });
  }
}

// router에서 사용할 수 있도록 조립
const articleRepository = new ArticleRepogitory();
const articleService = new ArticleService(articleRepository);
export const articleController = new ArticleController(articleService);
