import { ArticlePublicData, ArticleFindOptions, UpdateArticleData } from '../libs/interfaces';
declare function findById(id: number, userId?: number): Promise<{
    articleLikes: {
        id: number;
        createdAt: Date;
        userId: number;
        articleId: number;
    }[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
}>;
declare function findAll(findOptions: ArticleFindOptions, userId: number): Promise<({
    articleLikes: {
        id: number;
        createdAt: Date;
        userId: number;
        articleId: number;
    }[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
})[]>;
declare function create(userFields: ArticlePublicData): Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
}>;
declare function update(id: number, data: UpdateArticleData): Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
}>;
declare function ondelete(id: number): Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
}>;
declare const _default: {
    findById: typeof findById;
    findAll: typeof findAll;
    create: typeof create;
    update: typeof update;
    ondelete: typeof ondelete;
};
export default _default;
//# sourceMappingURL=articleRepository.d.ts.map