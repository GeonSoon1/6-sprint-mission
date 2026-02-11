declare function find(userId: number, articleId: number): Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    articleId: number;
} | null>;
declare function create(userId: number, articleId: number): Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    articleId: number;
}>;
declare function remove(id: number): Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    articleId: number;
}>;
declare const _default: {
    find: typeof find;
    create: typeof create;
    remove: typeof remove;
};
export default _default;
//# sourceMappingURL=articleLikeRepository.d.ts.map