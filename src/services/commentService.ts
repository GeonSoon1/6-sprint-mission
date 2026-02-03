import commentRepository from '../repositories/commentRepository';
import { CustomError } from '../libs/Handler/errorHandler';

class CommentService {
    async getComments(take: number, cursor: number | undefined, productId: number | undefined, articleId: number | undefined) {
        const comments = await commentRepository.findAll(take, cursor, productId, articleId);
        let nextCursor = null;
        if (comments.length > 0 && comments.length === take) {
            nextCursor = comments[comments.length - 1]!.id;
        }

        return { comments, nextCursor };
    }

    async getCommentById(id: number) {
        return await commentRepository.findById(id);
    }

    async createComment(userId: number, content: string, productId?: number, articleId?: number) {
        if ((productId && articleId) || (!productId && !articleId)) {
            throw new CustomError(400, 'Comment must belong to EITHER a Product OR an Article.');
        }
        if (!content || content.trim() === '') {
            throw new CustomError(400, 'Content cannot be empty.');
        }

        // 2. 댓글 생성 (DB 저장)
        const comment = await commentRepository.create(content, userId, productId, articleId);

        // 3. 알림 로직 시작
        let notification = null;
        let ownerId: number | undefined;
        let targetName = "";

        // 상품 댓글인 경우
        if (productId) {
            const product = await commentRepository.findProductOwner(productId);
            if (product) {
                ownerId = product.userId; // 상품 주인 ID
                targetName = product.name;
            }
        }
        // 아티클 댓글인 경우
        else if (articleId) {
            const article = await commentRepository.findArticleOwner(articleId);
            if (article) {
                ownerId = article.userId; // 아티클 주인 ID
                targetName = article.title;
            }
        }

        // 4. 작성자가 본인이 아닐 경우에만 알림 생성
        // (ownerId가 존재하고, 댓글 쓴 사람(userId)과 다를 때)
        if (ownerId && ownerId !== userId) {
            const message = `작성하신 글 '${targetName}'에 새로운 댓글이 달렸습니다: ${content}`;

            // DB에 알림 저장
            notification = await commentRepository.createNotification(ownerId, message);
        }

        // 5. 댓글 정보와 알림 정보(있으면)를 함께 반환
        return { comment, notification };
    }

    async updateComment(id: number, content: string) {
        if (content !== undefined && content.trim() === '') {
            throw new CustomError(400, 'Content cannot be empty.');
        }

        return await commentRepository.update(id, content);
    }

    async deleteComment(id: number) {
        return await commentRepository.delete(id);
    }
}

export const commentService = new CommentService();