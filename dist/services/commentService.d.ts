import { UpdateCommentDTO } from '../types/dto.js';
export declare class CommentService {
    updateComment(id: number, userId: number, data: UpdateCommentDTO): Promise<{
        id: number;
        content: string;
        productId: number | null;
        articleId: number | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteComment(id: number, userId: number): Promise<void>;
}
export declare const commentService: CommentService;
//# sourceMappingURL=commentService.d.ts.map