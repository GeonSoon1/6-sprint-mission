import { Prisma } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';

interface data {
  id: number;
  content: string;
  authorId: number;
}

export const commentRepository = {
  createComment(data: Prisma.CommentUncheckedCreateInput) {
    return prismaClient.comment.create({ data });
  },

  getCommentList({ cursor, take, where, orderBy }: Prisma.CommentFindManyArgs) {
    return prismaClient.comment.findMany({
      cursor,
      take,
      where,
      orderBy,
    });
  },

  findComment(id: number) {
    return prismaClient.comment.findUnique({ where: { id } });
  },

  updateComment(id: number, data: Prisma.CommentUncheckedUpdateInput) {
    return prismaClient.comment.update({
      where: { id },
      data,
    });
  },

  deleteComment(id: number) {
    return prismaClient.comment.delete({ where: { id } });
  },
};
