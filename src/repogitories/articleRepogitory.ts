import { Prisma } from '@prisma/client';
import { ArticleCreateDto } from '../dto/articleDto';
import prisma from '../libs/prismaClient';

export class ArticleRepogitory {
  // 게시글 생성
  async create(data: ArticleCreateDto) {
    return prisma.article.create({ data });
  }

  //게시글 목록 조회
  async findMany(params: {
    where: Prisma.ArticleWhereInput;
    orderBy: Prisma.ArticleOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    return prisma.article.findMany({
      ...params,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        articleLikeCount: true,
      },
    });
  }

  // 게시글 목록 조회 유저 좋아요 여부
  async findUserLikedArticles(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { likedArticles: true },
    });

    if (!user) return [];

    return user.likedArticles.map((a) => a.articleId);
  }

  // 게시글 상세 조회
  async findById(id: string) {
    return prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        articleLikeCount: true,
      },
    });
  }
  // 게시글 상세 조회 유저 좋아요 여부
  async checkUserLiked(userId: string, articleId: string) {
    return prisma.likedArticle.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  }

  // 게시글 수정
  async update(id: string, data: Prisma.ArticleUpdateInput) {
    return prisma.article.update({ where: { id }, data });
  }

  // 게시글 삭제
  async delete(id: string) {
    return prisma.article.delete({ where: { id } });
  }

  // 유저가 생성한 게시글 목록 조회
  async findByUserId(userId: string) {
    return prisma.article.findMany({ where: { userId } });
  }
}
