import { Like } from '@prisma/client';
import { CreateLikeDTO } from '../types/dto.js';
export declare class LikeRepository {
    findByArticleIdAndUserId(articleId: number, userId: number): Promise<Like | null>;
    create(data: CreateLikeDTO): Promise<Like>;
    delete(id: number): Promise<void>;
}
export declare const likeRepository: LikeRepository;
//# sourceMappingURL=likeRepository.d.ts.map