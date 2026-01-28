import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  /* =====================
   * 1. User
   * ===================== */
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'user1@test.com',
        nickname: '토끼',
        password: 'password1',
        image: null,
      },
      {
        email: 'user2@test.com',
        nickname: '고양이',
        password: 'password2',
        image: null,
      },
      {
        email: 'user3@test.com',
        nickname: '강아지',
        password: 'password3',
        image: null,
      },
    ],
  });

  const userList = await prisma.user.findMany();

  /* =====================
   * 2. Article
   * ===================== */
  const articles = await prisma.article.createMany({
    data: userList.map((user, index) => ({
      title: `아티클 제목 ${index + 1}`,
      content: `아티클 내용 ${index + 1}`,
      image: null,
      userId: user.id,
    })),
  });

  const articleList = await prisma.article.findMany();

  /* =====================
   * 3. Product
   * ===================== */
  const products = await prisma.product.createMany({
    data: userList.map((user, index) => ({
      name: `상품 ${index + 1}`,
      description: `상품 설명 ${index + 1}`,
      price: 10000 * (index + 1),
      tags: ['handmade', 'knit', 'yarn'],
      images: ['https://placehold.co/300x300', 'https://placehold.co/300x300'],
      userId: user.id,
    })),
  });

  const productList = await prisma.product.findMany();

  /* =====================
   * 4. Comment
   * ===================== */
  await prisma.comment.createMany({
    data: [
      // Article 댓글
      {
        content: '아티클 좋아요!',
        userId: userList[1].id,
        articleId: articleList[0].id,
      },
      {
        content: '도움 많이 됐어요',
        userId: userList[2].id,
        articleId: articleList[1].id,
      },
      {
        content: '공감합니다',
        userId: userList[0].id,
        articleId: articleList[2].id,
      },

      // Product 댓글
      {
        content: '이 상품 너무 예뻐요',
        userId: userList[0].id,
        productId: productList[0].id,
      },
      {
        content: '퀄리티 좋아 보이네요',
        userId: userList[1].id,
        productId: productList[1].id,
      },
      {
        content: '재구매 의사 있음!',
        userId: userList[2].id,
        productId: productList[2].id,
      },
    ],
  });

  /* =====================
   * 5. Like (Article)
   * ===================== */
  await prisma.like.createMany({
    data: [
      {
        userId: userList[0].id,
        articleId: articleList[1].id,
      },
      {
        userId: userList[1].id,
        articleId: articleList[2].id,
      },
      {
        userId: userList[2].id,
        articleId: articleList[0].id,
      },
    ],
  });

  /* =====================
   * 6. Favorite (Product)
   * ===================== */
  await prisma.favorite.createMany({
    data: [
      {
        userId: userList[0].id,
        productId: productList[1].id,
      },
      {
        userId: userList[1].id,
        productId: productList[2].id,
      },
      {
        userId: userList[2].id,
        productId: productList[0].id,
      },
    ],
  });

  console.log('🌱 시드 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
