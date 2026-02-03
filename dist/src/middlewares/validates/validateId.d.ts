import * as s from 'superstruct';
import { Request, Response, NextFunction } from 'express';
export declare const validateId: s.Struct<{
    id?: any;
}, {
    id: s.Struct<any, null>;
}>;
export declare const validateProductId: s.Struct<{
    productId?: any;
}, {
    productId: s.Struct<any, null>;
}>;
export declare const validateArticleId: s.Struct<{
    articleId?: any;
}, {
    articleId: s.Struct<any, null>;
}>;
export declare const validateNotificationId: s.Struct<{
    notificationId?: any;
}, {
    notificationId: s.Struct<any, null>;
}>;
export declare const validateIdParam: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateProductIdParam: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateArticleIdParam: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateNotificationIdParam: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validateId.d.ts.map