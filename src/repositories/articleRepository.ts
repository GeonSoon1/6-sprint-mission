import { Prisma, PrismaClient, User } from '@prisma/client';

export class ArticleRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * 게시물 생성
   */
  async createArticle(data: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({ data });
  }

  /**
   * 게시물 목록 조회
   */
  async findArticles(options: Prisma.ArticleFindManyArgs) {
    return this.prisma.article.findMany(options);
  }

  /**
   * 게시물 상세 조회
   */
  async findArticleById(id: User['id']) {
    return this.prisma.article.findUnique({ where: { id } });
  }

  /**
   * 게시물 수정
   */
  async updateArticle(id: User['id'], data: Prisma.ArticleUpdateInput) {
    return this.prisma.article.update({ where: { id }, data });
  }

  /**
   * 게시물 삭제
   */
  async deleteArticle(id: User['id']) {
    return this.prisma.article.delete({ where: { id } });
  }
}
