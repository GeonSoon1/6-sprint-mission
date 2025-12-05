import prisma from '../lib/prismaclient';

export async function articleUserCheck(userId: number, articleId: number) {
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!article || !findUser) {
    // article 또는 user가 DB에 있는지 확인
    return false;
  } else if (article.userId !== userId) {
    // DB에 있는 article userID 정보와 로그인 한 User 정보가 같은지 확인
    return false;
  }
  return true;
}
