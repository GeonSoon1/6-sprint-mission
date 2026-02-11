import { ProductPublicData, ProductFindOptions, UpdateProductData } from './../libs/interfaces';
declare function findByUserId(userId: number): Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string | null;
    price: number;
    tags: string[];
}[]>;
declare function findById(id: number, userId?: number): Promise<{
    productLikes: {
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
    }[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string | null;
    price: number;
    tags: string[];
}>;
declare function findAll(findOptions: ProductFindOptions, userId: number): Promise<({
    productLikes: {
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
    }[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string | null;
    price: number;
    tags: string[];
})[]>;
declare function update(id: number, data: UpdateProductData): Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string | null;
    price: number;
    tags: string[];
}>;
declare function create(userFields: ProductPublicData): Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string | null;
    price: number;
    tags: string[];
}>;
declare function ondelete(id: number): Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string | null;
    price: number;
    tags: string[];
}>;
declare const _default: {
    findById: typeof findById;
    findAll: typeof findAll;
    update: typeof update;
    create: typeof create;
    ondelete: typeof ondelete;
    findByUserId: typeof findByUserId;
};
export default _default;
//# sourceMappingURL=productRepository.d.ts.map