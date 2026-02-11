import { Request, Response, NextFunction } from 'express';
declare const verifyRefreshToken: {
    (req: Request, res: Response, next: NextFunction): Promise<void>;
    unless: typeof import("express-unless").unless;
};
declare const verifyAccessToken: {
    (req: Request, res: Response, next: NextFunction): Promise<void>;
    unless: typeof import("express-unless").unless;
};
declare function authorizeUser(req: Request, res: Response, next: NextFunction): Promise<void>;
declare function optionalAuth(req: Request, res: Response, next: NextFunction): void;
declare function authorizeProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
declare function authorizeArticle(req: Request, res: Response, next: NextFunction): Promise<void>;
declare function authorizeComment(req: Request, res: Response, next: NextFunction): Promise<void>;
export { verifyRefreshToken, verifyAccessToken, authorizeUser, optionalAuth, authorizeProduct, authorizeArticle, authorizeComment, };
//# sourceMappingURL=auth.d.ts.map