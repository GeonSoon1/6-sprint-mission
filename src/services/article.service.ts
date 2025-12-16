import { ArticleRepository } from "../repositories/article.repository";
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleResponseDto,
} from "../dtos/article.dto";
import { PaginatedResponse } from "../types";
import { NotFoundError, ForbiddenError } from "../utils/errors";

export class ArticleService {
  private articleRepository: ArticleRepository;

  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  async createArticle(
    userId: number,
    data: CreateArticleDto
  ): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.create(userId, data);
    return article;
  }

  async getArticle(id: number, userId?: number): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    let isLiked = false;
    if (userId) {
      const like = await this.articleRepository.findLike(userId, id);
      isLiked = !!like;
    }

    return {
      ...article,
      isLiked,
      likeCount: article._count.likes,
    };
  }

  async getArticles(
    page: number = 1,
    limit: number = 10,
    keyword?: string,
    orderBy?: string
  ): Promise<PaginatedResponse<any>> {
    const skip = (page - 1) * limit;
    const { articles, total } = await this.articleRepository.findMany({
      skip,
      take: limit,
      keyword,
      orderBy: orderBy as "recent" | undefined,
    });

    return {
      data: articles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async updateArticle(
    id: number,
    userId: number,
    data: UpdateArticleDto
  ): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    if (article.userId !== userId) {
      throw new ForbiddenError("게시글을 수정할 권한이 없습니다.");
    }

    const updatedArticle = await this.articleRepository.update(id, data);
    return updatedArticle;
  }

  async deleteArticle(id: number, userId: number): Promise<void> {
    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    if (article.userId !== userId) {
      throw new ForbiddenError("게시글을 삭제할 권한이 없습니다.");
    }

    await this.articleRepository.delete(id);
  }

  async toggleLike(
    userId: number,
    articleId: number
  ): Promise<{ isLiked: boolean }> {
    const article = await this.articleRepository.findById(articleId);
    if (!article) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    const existingLike = await this.articleRepository.findLike(
      userId,
      articleId
    );

    if (existingLike) {
      await this.articleRepository.deleteLike(userId, articleId);
      return { isLiked: false };
    } else {
      await this.articleRepository.createLike(userId, articleId);
      return { isLiked: true };
    }
  }
}
