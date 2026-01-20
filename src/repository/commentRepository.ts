import prisma from '../lib/prisma';

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
}

export default new CommentRepository();
