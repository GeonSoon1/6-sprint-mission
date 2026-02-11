import { Prisma, Product } from '@prisma/client';
import { ProductCreateDto, ProductQueryDto } from '../products/product.dto';
export declare class ProductRepository {
    create(data: ProductCreateDto): Promise<{
        name: string;
        description: string;
        price: number;
        tags: string[];
        id: string;
        productLikeCount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAll(query: ProductQueryDto): Promise<{
        name: string;
        price: number;
        id: string;
        productLikeCount: number;
        createdAt: Date;
    }[]>;
    findLikedProductsByUser(userId: string): Promise<string[]>;
    findById(id: string): Promise<{
        name: string;
        description: string;
        price: number;
        tags: string[];
        id: string;
        productLikeCount: number;
        createdAt: Date;
    }>;
    findLikedByUser(userId: string, productId: string): Promise<{
        productId: string;
        createdAt: Date;
        userId: string;
    } | null>;
    update(id: string, data: Prisma.ProductUpdateInput): Promise<{
        name: string;
        description: string;
        price: number;
        tags: string[];
        id: string;
        productLikeCount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    delete(id: string): Promise<{
        name: string;
        description: string;
        price: number;
        tags: string[];
        id: string;
        productLikeCount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findByUserId(userId: string): Promise<Product[]>;
    findLikers(productId: string): Promise<string[]>;
}
//# sourceMappingURL=product.repository.d.ts.map