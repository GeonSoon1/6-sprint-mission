export interface ProductCreateDto {
    name: string;
    description: string;
    price: number;
    tags: string[];
    userId: string;
}
export interface ProductQueryDto {
    page: number;
    limit: number;
    search: string;
    sort: 'recent' | 'oldest';
    userId: string | null;
}
export interface ProductUpdateDto {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
    userId: string;
}
//# sourceMappingURL=product.dto.d.ts.map