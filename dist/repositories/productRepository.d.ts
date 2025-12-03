import { Product, Favorite } from '@prisma/client';
import { CreateProductDTO, UpdateProductDTO, ProductListQueryDTO } from '../types/dto.js';
export declare class ProductRepository {
    findById(id: number): Promise<(Product & {
        favorites: Favorite[];
    }) | null>;
    findMany(query: ProductListQueryDTO, userId?: number): Promise<(Product & {
        favorites: Favorite[];
    })[]>;
    count(query: ProductListQueryDTO, userId?: number): Promise<number>;
    findUserFavorites(userId: number, query: ProductListQueryDTO): Promise<(Product & {
        favorites: Favorite[];
    })[]>;
    countUserFavorites(userId: number, query: ProductListQueryDTO): Promise<number>;
    create(data: CreateProductDTO & {
        userId: number;
    }): Promise<Product>;
    update(id: number, data: UpdateProductDTO): Promise<Product>;
    delete(id: number): Promise<void>;
}
export declare const productRepository: ProductRepository;
//# sourceMappingURL=productRepository.d.ts.map