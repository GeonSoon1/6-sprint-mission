import { CommentCreateDto, CommentQueryDto, CommentUpdateDto } from '../comments/comment.dto';
export declare class CommentRepository {
    create(dto: CommentCreateDto): Promise<{
        id: string;
        productId: string | null;
        articleId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
    }>;
    findManyComment(dto: CommentQueryDto): Promise<{
        id: string;
        createdAt: Date;
        content: string;
    }[]>;
    update(id: string, data: CommentUpdateDto): Promise<{
        id: string;
        productId: string | null;
        articleId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        productId: string | null;
        articleId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
    }>;
}
//# sourceMappingURL=comment.repository.d.ts.map