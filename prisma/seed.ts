import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      email: "user1@example.com",
      nickname: "사용자1",
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: {
      email: "user2@example.com",
      nickname: "사용자2",
      password: hashedPassword,
    },
  });

  console.log("Users created:", { user1, user2 });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: "아이폰 14 Pro",
      description: "거의 새것 같은 아이폰 14 Pro 판매합니다.",
      price: 1200000,
      tags: ["전자기기", "스마트폰", "애플"],
      userId: user1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "맥북 프로 M2",
      description: "2023년 구매한 맥북 프로 판매합니다.",
      price: 2500000,
      tags: ["전자기기", "노트북", "애플"],
      userId: user1.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "에어팟 프로 2세대",
      description: "미개봉 새상품입니다.",
      price: 300000,
      tags: ["전자기기", "이어폰", "애플"],
      userId: user2.id,
    },
  });

  console.log("Products created:", { product1, product2, product3 });

  // Create articles
  const article1 = await prisma.article.create({
    data: {
      title: "안녕하세요!",
      content: "처음 가입했습니다. 잘 부탁드립니다.",
      userId: user1.id,
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "중고 거래 팁 공유",
      content: "안전한 중고 거래를 위한 팁을 공유합니다...",
      userId: user2.id,
    },
  });

  const article3 = await prisma.article.create({
    data: {
      title: "이번 주말 날씨",
      content: "이번 주말 날씨가 좋다고 하네요!",
      userId: user1.id,
    },
  });

  console.log("Articles created:", { article1, article2, article3 });

  // Create product comments
  await prisma.productComment.create({
    data: {
      content: "가격 네고 가능한가요?",
      userId: user2.id,
      productId: product1.id,
    },
  });

  await prisma.productComment.create({
    data: {
      content: "직거래 가능한 지역이 어디인가요?",
      userId: user2.id,
      productId: product2.id,
    },
  });

  // Create article comments
  await prisma.articleComment.create({
    data: {
      content: "환영합니다!",
      userId: user2.id,
      articleId: article1.id,
    },
  });

  await prisma.articleComment.create({
    data: {
      content: "좋은 정보 감사합니다.",
      userId: user1.id,
      articleId: article2.id,
    },
  });

  // Create likes
  await prisma.productLike.create({
    data: {
      userId: user2.id,
      productId: product1.id,
    },
  });

  await prisma.articleLike.create({
    data: {
      userId: user1.id,
      articleId: article2.id,
    },
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
