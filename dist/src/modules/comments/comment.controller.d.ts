import { Request, Response } from 'express';
import { CommentService } from '../comments/comment.service';
export declare class CommentController {
    private service;
    constructor(service: CommentService);
    createProductComment(req: Request, res: Response): Promise<void>;
    getCommentsByProductId(req: Request, res: Response): Promise<void>;
    createArticleComment(req: Request, res: Response): Promise<void>;
    getCommentsByArticle(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
}
export declare const commentController: CommentController;
//# sourceMappingURL=comment.controller.d.ts.map