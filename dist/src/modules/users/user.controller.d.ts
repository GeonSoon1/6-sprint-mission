import { ArticleService } from '../articles/article.service';
import { LikeService } from '../likes/like.service';
import { ProductService } from '../products/product.service';
import { UserService } from '../users/user.service';
import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    private service;
    private productService;
    private articleService;
    private likeService;
    constructor(service: UserService, productService: ProductService, articleService: ArticleService, likeService: LikeService);
    createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    loginUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    newRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    logOutUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserArticles(req: Request, res: Response): Promise<void>;
    likeProductButton(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    likeArticleButton(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    likeProductList(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    likeArticleList(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const userController: UserController;
//# sourceMappingURL=user.controller.d.ts.map