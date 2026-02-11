import { Comment } from '@prisma/client';
import { CommentCreateDto, CommentQueryDto, CommentUpdateDto } from '../comments/comment.dto';
import { CommentRepository } from '../comments/comment.repository';
import { ArticleRepogitory } from '../articles/article.repository';
import { NotificationService } from '../notifications/notification.service';
type GetCommentData = Omit<Comment, 'updatedAt' | 'productId' | 'articleId' | 'userId'>;
export declare class CommentService {
    private repo;
    private articleRepo;
    private notificationService;
    constructor(repo: CommentRepository, articleRepo: ArticleRepogitory, notificationService: NotificationService);
    create(dto: CommentCreateDto): Promise<Comment>;
    getCommentsByProduct(dto: CommentQueryDto): Promise<GetCommentData[]>;
    getCommentsByArticle(dto: CommentQueryDto): Promise<GetCommentData[]>;
    update(id: string, dto: CommentUpdateDto): Promise<Comment>;
    delete(id: string): Promise<void>;
}
export {};
//# sourceMappingURL=comment.service.d.ts.map