import { Comment } from '@prisma/client';
import { CreateProductDTO, UpdateProductDTO, ProductListQueryDTO, ProductResponseDTO, CreateCommentDTO, CommentListQueryDTO } from '../types/dto.js';
export declare class ProductService {
    createProduct(userId: number, data: CreateProductDTO): Promise<{
        id: number;
        name: string;
        description: string;
        price: number;
        tags: string[];
        images: string[];
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProduct(id: number, userId?: number): Promise<ProductResponseDTO>;
    updateProduct(id: number, userId: number, data: UpdateProductDTO): Promise<{
        id: number;
        name: string;
        description: string;
        price: number;
        tags: string[];
        images: string[];
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteProduct(id: number, userId: number): Promise<void>;
    getProductList(query: ProductListQueryDTO, userId?: number): Promise<{
        list: ProductResponseDTO[];
        totalCount: number;
    }>;
    createComment(productId: number, userId: number, data: CreateCommentDTO): Promise<{
        id: number;
        content: string;
        productId: number | null;
        articleId: number | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCommentList(productId: number, query: CommentListQueryDTO): Promise<{
        list: Comment[];
        nextCursor: number | null;
    }>;
    createFavorite(productId: number, userId: number): Promise<void>;
    deleteFavorite(productId: number, userId: number): Promise<void>;
}
export declare const productService: ProductService;
//# sourceMappingURL=productService.d.ts.map