import * as s from 'superstruct';
import { Request, Response, NextFunction } from 'express';
declare const createArticleSchema: s.Struct<{
    title: string;
    content: string;
}, {
    title: s.Struct<string, null>;
    content: s.Struct<string, null>;
}>;
declare function validateCreateArticle(req: Request, res: Response, next: NextFunction): void;
declare const updateArticleSchema: s.Struct<{
    title?: string | undefined;
    content?: string | undefined;
}, import("superstruct/dist/utils.js", { with: { "resolution-mode": "import" } }).PartialObjectSchema<{
    title: s.Struct<string, null>;
    content: s.Struct<string, null>;
}>>;
declare function validateUpdateArticle(req: Request, res: Response, next: NextFunction): void;
declare const getArticleQuerySchema: s.Struct<{
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    skip?: number | undefined;
    sort?: "" | "recent" | "oldest" | undefined;
}, {
    page: s.Struct<number | undefined, null>;
    limit: s.Struct<number | undefined, null>;
    search: s.Struct<string | undefined, null>;
    skip: s.Struct<number | undefined, null>;
    sort: s.Struct<"" | "recent" | "oldest" | undefined, null>;
}>;
declare function validateGetListArticle(// req = 재할당
req: Request, res: Response, next: NextFunction): void;
export { validateCreateArticle, validateUpdateArticle, validateGetListArticle, getArticleQuerySchema, updateArticleSchema, createArticleSchema, };
//# sourceMappingURL=validateArticle.d.ts.map