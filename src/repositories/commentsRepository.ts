import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

const createComment = async (data: Prisma.CommentCreateInput, select?: Prisma.CommentSelect) => {
  return prisma.comment.create({
    data,
    select,
  });
};

const findComments = async (params: Prisma.CommentFindManyArgs) => {
  return prisma.comment.findMany(params);
};

const findCommentById = async (id: string, select?: Prisma.CommentSelect) => {
  return prisma.comment.findUniqueOrThrow({
    where: { id },
    select,
  });
};

const updateComment = async (id: string, content: string) => {
  return prisma.comment.update({
    where: { id },
    data: { content },
  });
};

const deleteComment = async (id: string) => {
  return prisma.comment.delete({
    where: { id },
  });
};

export const commentsRepository = {
  createComment,
  findComments,
  findCommentById,
  updateComment,
  deleteComment,
};
