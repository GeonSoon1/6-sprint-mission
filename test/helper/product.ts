import { prismaClient } from '@lib/prismaClient';
import { userSample, productSample } from './mockdata';

export async function createProductsWithUsers() {
  // 관계형 FK 유저 등록 진행
  await prismaClient.user.createMany({ data: userSample });

  const users = await prismaClient.user.findMany({
    orderBy: { id: 'asc' },
  });

  // 상품 등록 데이터에 user 정보 추가
  const products = productSample.map((product, index) => ({
    ...product,
    userId: users[index % users.length].id,
  }));

  // 상품 등록
  await prismaClient.product.createMany({ data: products });

  return { users, products };
}
