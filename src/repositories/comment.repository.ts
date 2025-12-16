import prisma from "../utils/prisma";
import { ProductComment, ArticleComment } from "@prisma/client";
import { CreateCommentDto, UpdateCommentDto } from "../dtos/comment.dto";

export class CommentRepository {
  // Product Comments
  async createProductComment(
    userId: number,
    productId: number,
    data: CreateCommentDto
  ): Promise<ProductComment> {
    return prisma.productComment.create({
      data: {
        ...data,
        userId,
        productId,
      },
    });
  }

  async findProductCommentById(id: number): Promise<ProductComment | null> {
    return prisma.productComment.findUnique({
      where: { id },
    });
  }

  async findProductComments(
    productId: number,
    cursor?: number,
    limit: number = 10
  ) {
    const comments = await prisma.productComment.findMany({
      where: {
        productId,
        ...(cursor && { id: { lt: cursor } }),
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    return comments;
  }

  async updateProductComment(
    id: number,
    data: UpdateCommentDto
  ): Promise<ProductComment> {
    return prisma.productComment.update({
      where: { id },
      data,
    });
  }

  async deleteProductComment(id: number): Promise<void> {
    await prisma.productComment.delete({
      where: { id },
    });
  }

  // Article Comments
  async createArticleComment(
    userId: number,
    articleId: number,
    data: CreateCommentDto
  ): Promise<ArticleComment> {
    return prisma.articleComment.create({
      data: {
        ...data,
        userId,
        articleId,
      },
    });
  }

  async findArticleCommentById(id: number): Promise<ArticleComment | null> {
    return prisma.articleComment.findUnique({
      where: { id },
    });
  }

  async findArticleComments(
    articleId: number,
    cursor?: number,
    limit: number = 10
  ) {
    const comments = await prisma.articleComment.findMany({
      where: {
        articleId,
        ...(cursor && { id: { lt: cursor } }),
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    return comments;
  }

  async updateArticleComment(
    id: number,
    data: UpdateCommentDto
  ): Promise<ArticleComment> {
    return prisma.articleComment.update({
      where: { id },
      data,
    });
  }

  async deleteArticleComment(id: number): Promise<void> {
    await prisma.articleComment.delete({
      where: { id },
    });
  }
}
