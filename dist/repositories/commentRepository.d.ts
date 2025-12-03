import { Comment } from '@prisma/client';
import { CreateCommentDTO, UpdateCommentDTO, CommentListQueryDTO } from '../types/dto.js';
export declare class CommentRepository {
    findById(id: number): Promise<Comment | null>;
    findByProductId(productId: number, query: CommentListQueryDTO): Promise<Comment[]>;
    findByArticleId(articleId: number, query: CommentListQueryDTO): Promise<Comment[]>;
    create(data: CreateCommentDTO & {
        userId: number;
        productId?: number;
        articleId?: number;
    }): Promise<Comment>;
    update(id: number, data: UpdateCommentDTO): Promise<Comment>;
    delete(id: number): Promise<void>;
}
export declare const commentRepository: CommentRepository;
//# sourceMappingURL=commentRepository.d.ts.map