import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Prisma seed 시작');

  /**
   * 0️⃣ 기존 데이터 정리 (선택)
   * FK 때문에 순서 중요
   */
  await prisma.like.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 기존 데이터 삭제 완료');

  /**
   * 1️⃣ 유저 1명 생성 (모든 데이터의 작성자)
   */
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      nickname: 'test-user',
      password: 'hashed-password', // 실제 로그인 안 할 거면 아무 값 OK
      image: null,
    },
  });

  console.log('👤 User 생성 완료:', user.id);

  /**
   * 2️⃣ 게시글 30개 생성
   */
  const articles = [];

  for (let i = 1; i <= 30; i++) {
    const article = await prisma.article.create({
      data: {
        title: `Article ${i}`,
        content: `This is the content of article ${i}.`,
        image: `https://example.com/image${i}.jpg`,
        userId: user.id,
      },
    });

    articles.push(article);
  }

  console.log('📝 Articles 30개 생성 완료');

  /**
   * 3️⃣ 게시글 1, 2번에 댓글 10개씩
   */
  for (const article of articles.slice(0, 2)) {
    for (let i = 1; i <= 10; i++) {
      await prisma.comment.create({
        data: {
          content: `This is the content of article ${article.id} comment ${i}.`,
          articleId: article.id,
          userId: user.id,
        },
      });
    }
  }

  console.log('💬 Article 댓글 생성 완료');

  /**
   * 4️⃣ 상품 30개 생성
   */
  const products = [];

  for (let i = 1; i <= 30; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Test Product ${i}`,
        description: `This is a test product description ${i}.`,
        price: 100,
        tags: ['test', 'product'],
        images: ['image1.png', 'image2.png'],
        userId: user.id,
      },
    });

    products.push(product);
  }

  console.log('📦 Products 30개 생성 완료');

  /**
   * 5️⃣ 상품 1, 2번에 댓글 10개씩
   */
  for (const product of products.slice(0, 2)) {
    for (let i = 1; i <= 10; i++) {
      await prisma.comment.create({
        data: {
          content: `This is the content of product ${product.id} comment ${i}.`,
          productId: product.id,
          userId: user.id,
        },
      });
    }
  }

  console.log('💬 Product 댓글 생성 완료');

  /**
   * 6️⃣ 좋아요 / 찜 더미 (선택)
   */
  await prisma.like.createMany({
    data: articles.slice(0, 10).map((article) => ({
      articleId: article.id,
      userId: user.id,
    })),
  });

  await prisma.favorite.createMany({
    data: products.slice(0, 10).map((product) => ({
      productId: product.id,
      userId: user.id,
    })),
  });

  console.log('❤️ Like / Favorite 생성 완료');

  console.log('🌱 Prisma seed 완료');
}

main()
  .catch((e) => {
    console.error('❌ Seed 에러', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
