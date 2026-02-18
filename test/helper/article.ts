import { prismaClient } from '@lib/prismaClient';
import { userSample, articleSample } from './mockdata';

export async function createArticlesWithUsers() {
  // 관계형 USER 먼저 등록
  await prismaClient.user.createMany({ data: userSample });

  const users = await prismaClient.user.findMany({
    orderBy: { id: 'asc' },
  });

  // 게시글 mockdata에 userId 정보 추가
  const articles = articleSample.map((article, idx) => ({
    ...article,
    userId: users[idx % users.length].id,
  }));

  // 게시글 등록
  await prismaClient.article.createMany({ data: articles });

  return { users, articles };
}
