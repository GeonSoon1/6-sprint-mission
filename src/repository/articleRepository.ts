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
}

export default new ArticleRepository();
