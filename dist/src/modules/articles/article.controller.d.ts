import { Request, Response } from 'express';
import { ArticleService } from '../articles/article.service';
export declare class ArticleController {
    private service;
    constructor(service: ArticleService);
    create(req: Request, res: Response): Promise<void>;
    getArticles(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
}
export declare const articleController: ArticleController;
//# sourceMappingURL=article.controller.d.ts.map