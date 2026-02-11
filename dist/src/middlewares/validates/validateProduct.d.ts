import * as s from 'superstruct';
import { Request, Response, NextFunction } from 'express';
declare const createProductSchema: s.Struct<{
    name: string;
    description: string;
    price: number;
    tags: string[];
}, {
    name: s.Struct<string, null>;
    description: s.Struct<string, null>;
    price: s.Struct<number, null>;
    tags: s.Struct<string[], s.Struct<string, null>>;
}>;
declare function validateCreateProduct(req: Request, res: Response, next: NextFunction): void;
declare const updateProductSchema: s.Struct<{
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    tags?: string[] | undefined;
}, import("superstruct/dist/utils.js", { with: { "resolution-mode": "import" } }).PartialObjectSchema<{
    name: s.Struct<string, null>;
    description: s.Struct<string, null>;
    price: s.Struct<number, null>;
    tags: s.Struct<string[], s.Struct<string, null>>;
}>>;
declare function validateUpdateProduct(req: Request, res: Response, next: NextFunction): void;
declare const getProductQuerySchema: s.Struct<{
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
declare function validateGetListProduct(req: Request, res: Response, next: NextFunction): void;
export { validateCreateProduct, validateGetListProduct, validateUpdateProduct, createProductSchema, updateProductSchema, getProductQuerySchema, };
//# sourceMappingURL=validateProduct.d.ts.map