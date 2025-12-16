import { Prisma, PrismaClient, Article, ArticleComment } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di';

@injectable()
export class ArticleCommentRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  /**
   * 댓글 작성
   */
  async create(data: Prisma.ArticleCommentCreateInput) {
    return this.prisma.articleComment.create({ data });
  }

  /**
   * 게시물ID로 댓글 찾기
   */
  async findByArticleId(articleId: Article['id']) {
    return this.prisma.articleComment.findMany({ where: { articleId } });
  }

  /**
   * 댓글 ID로 찾기
   */
  async findById(id: ArticleComment['id']) {
    return this.prisma.articleComment.findUnique({ where: { id } });
  }

  /**
   * 댓글 수정하기
   */
  async update(id: ArticleComment['id'], data: Prisma.ArticleCommentUpdateInput) {
    return this.prisma.articleComment.update({ where: { id }, data });
  }

  /**
   * 댓글 삭제하기
   */
  async delete(id: ArticleComment['id']) {
    return this.prisma.articleComment.delete({ where: { id } });
  }
}
