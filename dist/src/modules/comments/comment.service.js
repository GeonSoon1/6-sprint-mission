"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
class CommentService {
    repo;
    articleRepo;
    notificationService;
    constructor(repo, articleRepo, notificationService) {
        this.repo = repo;
        this.articleRepo = articleRepo;
        this.notificationService = notificationService;
    }
    async create(dto) {
        const comment = await this.repo.create(dto);
        // 게시글 댓글인 경우 알림 발송
        if (dto.articleId) {
            const authorId = await this.articleRepo.findUserId(dto.articleId);
            // 작성자가 존재하고, 본인이 쓴 댓글이 아닐 경우에만 알림
            if (authorId && authorId !== dto.userId) {
                const message = '내가 판매 신청한 매물에 새로운 댓글이 달렸습니다.';
                await this.notificationService.create(authorId, message);
            }
        }
        return comment;
    }
    async getCommentsByProduct(dto) {
        return this.repo.findManyComment(dto);
    }
    async getCommentsByArticle(dto) {
        return this.repo.findManyComment(dto);
    }
    async update(id, dto) {
        return this.repo.update(id, dto);
    }
    async delete(id) {
        await this.repo.delete(id);
    }
}
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map