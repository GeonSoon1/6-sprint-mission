import prisma from '../lib/prisma';

class ArticleRepository {
  findMany(where: any, orderBy: any, skip: number, take: number) {
    return prisma.article.findMany({ where, orderBy, skip, take });
  }

  create(data: any) {
    return prisma.article.create({ data });
  }

  findById(id: number) {
    return prisma.article.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return prisma.article.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return prisma.article.delete({ where: { id } });
  }

  createComment(articleId: number, content: string) {
    return prisma.comment.create({
      data: {
        content,
        article: { connect: { id: articleId } },
      },
      include: { article: true },
    });
  }

  findComments(articleId: number, cursor: number | undefined, take: number) {
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
}

export default new ArticleRepository();
