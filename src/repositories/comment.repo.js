import { prisma } from "../lib/prisma";

export async function createComment(data) {
  return await prisma.comment.create({
    data: {
      content: data.content,
      user: {
        connect : { id: data.userId }
      },
      ...(data.productId && {
        product: {
          connect : { id: data.productId }
        }
      }),
      ...(data.articleId && {
        article : {
          connect : { id:data.articleId}
        }
      })
    }
  })
}

export async function getCommentById(id) {
  return await prisma.comment.findUnique({
    where: { id }
  })
}

export async function updateComment(id, data) {
  return await prisma.comment.update({
    where: { id },
    data
  })
}

export async function deleteComment(id) {
  return await prisma.comment.delete({
    where: { id }
  })
}