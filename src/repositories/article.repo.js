import { prisma } from "../lib/prisma.js";

export async function createArticle(data, user) {
  return await prisma.article.create({
    data: {
      ...data,
      user: {
        connect: { id: user.id },
      },
    },
  });
}

export async function getArticleById(id) {
  return await prisma.article.findUnique({
    where: { id },
  });
}

export async function updateArticle(id, data) {
  return await prisma.article.update({
    where: { id },
    data,
  });
}

export async function deleteArticle(id) {
  return await prisma.article.delete({
    where: { id },
  });
}

export async function getMyArticle(id) {
  return await prisma.article.findMany({
    where: { userId : id }
  })
}