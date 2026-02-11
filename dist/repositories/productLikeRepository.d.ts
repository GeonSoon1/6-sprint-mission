declare function find(userId: number, productId: number): Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    productId: number;
} | null>;
declare function create(userId: number, productId: number): Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    productId: number;
}>;
declare function remove(id: number): Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    productId: number;
}>;
declare function findLikedProductsByUserId(userId: number): Promise<({
    product: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        tags: string[];
    };
} & {
    id: number;
    createdAt: Date;
    userId: number;
    productId: number;
})[]>;
declare const _default: {
    find: typeof find;
    create: typeof create;
    remove: typeof remove;
    findLikedProductsByUserId: typeof findLikedProductsByUserId;
};
export default _default;
//# sourceMappingURL=productLikeRepository.d.ts.map