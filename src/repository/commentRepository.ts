import prisma from '../lib/prisma';
import { CreateCommentType } from '../structs/commentStructs';

class CommentRepository {
  findById(id: number) {
    return prisma.comment.findUnique({ where: { id } });
  }

  updateComment(id: number, content: string) {
    return prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  deleteComment(id: number) {
    return prisma.comment.delete({
      where: { id },
    });
  }

  async findArticleAuthorIdByCommentId(commentId: number): Promise<number | null> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        article: {
          select: {
            userId: true,
          },
        },
      },
    });

    return comment?.article?.userId ?? null;
  }

  async findCommentAuthorIdByCommentId(commentId: number): Promise<number | null> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
      },
    });
    return comment?.userId ?? null;
  }

  createArticleComment(articleId: number, content: string, userId: number) {
    return prisma.comment.create({
      data: {
        content,
        article: { connect: { id: articleId } },
        user: { connect: { id: userId } },
      },
      include: { article: true },
    });
  }

  findArticleComments(articleId: number, cursor: number | undefined, take: number) {
    return prisma.comment.findMany({
      where: { articleId },
      select: { id: true, content: true, createdAt: true },
      take,
      ...(cursor
        ? {
            skip: 1,
            cursor: { id: cursor },
          }
        : {}),
      orderBy: { createdAt: 'desc' },
    });
  }

  createProductComment(productId: number, content: string) {
    return prisma.comment.create({
      data: {
        content,
        product: { connect: { id: productId } },
      },
      include: { product: true },
    });
  }

  getProductComments(productId: number, cursor: number | undefined, limit: number) {
    return prisma.comment.findMany({
      where: { productId },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      take: limit,
      ...(cursor
        ? {
            skip: 1,
            cursor: { id: cursor },
          }
        : {}),
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new CommentRepository();
