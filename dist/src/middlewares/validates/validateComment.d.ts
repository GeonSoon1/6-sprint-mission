import * as s from 'superstruct';
import { Request, Response, NextFunction } from 'express';
declare const createCommentSchema: s.Struct<{
    content: string;
}, {
    content: s.Struct<string, null>;
}>;
declare function validateCreateComment(req: Request, res: Response, next: NextFunction): void;
declare const updateCommentSchema: s.Struct<{
    content?: string | undefined;
}, import("superstruct/dist/utils.js", { with: { "resolution-mode": "import" } }).PartialObjectSchema<{
    content: s.Struct<string, null>;
}>>;
declare function validateUpdateComment(req: Request, res: Response, next: NextFunction): void;
declare const getListCommentSchema: s.Struct<{
    limit?: number | undefined;
    cursor?: string | undefined;
}, {
    cursor: s.Struct<string | undefined, null>;
    limit: s.Struct<number | undefined, null>;
}>;
declare function validateGetListComment(req: Request, res: Response, next: NextFunction): void;
export { validateCreateComment, validateUpdateComment, validateGetListComment, createCommentSchema, updateCommentSchema, getListCommentSchema, };
//# sourceMappingURL=validateComment.d.ts.map