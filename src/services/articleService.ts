import { ArticleRepository } from '../repositories/articleRepository';
import { Prisma, User, Article } from '@prisma/client';
import { CreateArticleDTO } from '../lib/dto';

export class ArticleService {
  constructor(private articleRepository: ArticleRepository) {}

  /**
   * 게시물 등록
   */
  async createArticle(authorId: User['id'], articleData: CreateArticleDTO) {
    const { title, content } = articleData;

    const dataToCreate: Prisma.ArticleCreateInput = {
      title,
      content,
      author: { connect: { id: authorId } },
    };
    return this.articleRepository.createArticle(dataToCreate);
  }

  /**
   * 게시물 목록 보기
   */
  async findArticles(options: Prisma.ArticleFindManyArgs) {
    return this.articleRepository.findArticles(options);
  }

  /**
   * 게시물 상세 보기
   */
  async findArticleById(id: Article['id']) {
    const article = await this.articleRepository.findArticleById(id);
    if (!article) {
      const error = new Error('게시글을 찾을 수 없습니다.');
      (error as any).status = 404;
      throw error;
    }
    return article;
  }

  /**
   * 게시물 수정
   */
  async updateArticle(
    articleId: Article['id'],
    userId: User['id'],
    data: Prisma.ArticleUpdateInput,
  ) {
    await this.checkArticleOwnership(articleId, userId);
    return await this.articleRepository.updateArticle(articleId, data);
  }

  /**
   * 게시물 삭제
   */
  async deleteArticle(articleId: Article['id'], userId: User['id']) {
    await this.checkArticleOwnership(articleId, userId);
    return this.articleRepository.deleteArticle(articleId);
  }

  /**
   * 헬퍼 메소드(private)
   */
  private async checkArticleOwnership(
    articleId: Article['id'],
    userId: User['id'],
  ) {
    const article = await this.articleRepository.findArticleById(articleId);

    if (!article) {
      const error = new Error('게시글을 찾을 수 없습니다.');
      (error as any).status = 404;
      throw error;
    }

    if (article.authorId !== userId) {
      const error = new Error('수정 권한이 없습니다.');
      (error as any).status = 403; // Forbidden(권한 없음)
      throw error;
    }
    return article;
  }
}
