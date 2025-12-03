import { Favorite } from '@prisma/client';
import { CreateFavoriteDTO } from '../types/dto.js';
export declare class FavoriteRepository {
    findByProductIdAndUserId(productId: number, userId: number): Promise<Favorite | null>;
    create(data: CreateFavoriteDTO): Promise<Favorite>;
    delete(id: number): Promise<void>;
}
export declare const favoriteRepository: FavoriteRepository;
//# sourceMappingURL=favoriteRepository.d.ts.map