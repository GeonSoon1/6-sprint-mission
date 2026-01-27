import * as s from "superstruct";
export declare const CreateProduct: s.Struct<{
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
export declare const CreateArticle: s.Struct<{
    title: string;
    content: string;
}, {
    title: s.Struct<string, null>;
    content: s.Struct<string, null>;
}>;
export declare const CreateComment: s.Struct<{
    content: string;
    productId?: number | undefined;
    articleId?: number | undefined;
}, {
    content: s.Struct<string, null>;
    productId: s.Struct<number | undefined, null>;
    articleId: s.Struct<number | undefined, null>;
}>;
export declare const PatchProduct: s.Struct<{
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    tags?: string[] | undefined;
}, import("superstruct/dist/utils").PartialObjectSchema<{
    name: s.Struct<string, null>;
    description: s.Struct<string, null>;
    price: s.Struct<number, null>;
    tags: s.Struct<string[], s.Struct<string, null>>;
}>>;
export declare const PatchArticle: s.Struct<{
    title?: string | undefined;
    content?: string | undefined;
}, import("superstruct/dist/utils").PartialObjectSchema<{
    title: s.Struct<string, null>;
    content: s.Struct<string, null>;
}>>;
export declare const PatchComment: s.Struct<{
    content?: string | undefined;
}, {
    content: s.Struct<string | undefined, null>;
}>;
//# sourceMappingURL=structs.d.ts.map