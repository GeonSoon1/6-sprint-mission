import { Article, Prisma } from '@prisma/client';
import {
  ArticleCreateDto,
  ArticleQueryDto,
  ArticleUpdateDto,
} from '../articles/article.dto';
import { ArticleRepogitory } from '../articles/article.repository';
import { NotFoundError } from '../../libs/error';

type GetArticleData = Omit<
  Article,
  'likedArticles' | 'userId' | 'updatedAt'
> & { isLiked?: boolean };
type getArticleById = Omit<Article, 'updatedAt' | 'userId'> & {
  isLiked?: boolean;
};

export class ArticleService {
  constructor(private repo: ArticleRepogitory) {}

  // 게시글 생성
  async create(dto: ArticleCreateDto): Promise<Article> {
    return this.repo.create(dto);
  }

  // 게시글 목록 조회 (페이지네이션, 정렬, 유저 인증 시 좋아요 여부)
  async getArticles(dto: ArticleQueryDto): Promise<GetArticleData[]> {
    const { page, limit, search, sort, userId } = dto;
    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const orderBy: Prisma.ArticleOrderByWithRelationInput = {
      createdAt: !sort || sort === 'recent' ? 'desc' : 'asc',
    };

    const articles = await this.repo.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    if (!userId) return articles;

    const likedIds = await this.repo.findUserLikedArticles(userId);

    const merged = articles.map((a) => ({
      ...a,
      isLiked: likedIds.includes(a.id),
    }));

    const sorted = merged.sort((a, b) =>
      !sort || sort === 'recent'
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : a.createdAt.getTime() - b.createdAt.getTime()
    );

    return sorted;
  }

  // 게시글 상세 조회(유저 인증 시 좋아요 여부)
  async getById(id: string, userId?: string | null): Promise<getArticleById> {
    const article = await this.repo.findById(id);
    if (!article) throw new NotFoundError();

    if (!userId) return { ...article, isLiked: false };

    const liked = await this.repo.checkUserLiked(userId, id);
    return { ...article, isLiked: !!liked };
  }

  // 게시글 수정
  async update(id: string, dto: ArticleUpdateDto): Promise<Article> {
    return this.repo.update(id, dto);
  }

  // 게시글 삭제
  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  // 유저가 생성한 게시글 목록 조회
  async getUserArticles(userId: string): Promise<Article[]> {
    return this.repo.findByUserId(userId);
  }
}
