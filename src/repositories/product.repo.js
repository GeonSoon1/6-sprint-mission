import { prisma } from "../lib/prisma";

export async function createProduct(data, userId) {
  const product = await prisma.product.create({
    data: {
      ...data,
      user: {
        connect: { id: userId },
      },
    },
  });
  return product;
}

export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
}

export async function updateProduct(id, data) {
  const product = await prisma.product.update({
    where: { id },
    data,
  });
  return product;
}

export async function deleteProduct(id) {
  return await prisma.product.delete({
    where: { id },
  });
}

export async function getMyProduct(id) {
  return await prisma.product.findMany({
    where: { userId: id}
  })
}
