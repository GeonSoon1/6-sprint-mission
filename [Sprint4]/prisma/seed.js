import { PrismaClient } from '@prisma/client';
import { fakerKO as faker } from '@faker-js/faker';
import { CATEGORIES, PRODUCT_STATUS } from '../src/lib/enums.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomProductName() {
  const adjectives = [
    '고급',
    '프리미엄',
    '신선한',
    '유기농',
    '한정판',
    '감성적인',
    '클래식',
  ];
  const items = [
    '커피',
    '와인',
    '초콜릿',
    '티셔츠',
    '가방',
    '이어폰',
    '캔들',
    '향수',
  ];
  const adjective = adjectives[getRandomInt(adjectives.length)];
  const item = items[getRandomInt(items.length)];
  return `${adjective} ${item}`;
}

function getRandomDescription() {
  const sentences = [
    '최고의 품질을 자랑합니다.',
    '지금 구매하시면 특별 할인 혜택을 드립니다.',
    '일상에 감성을 더하는 제품입니다.',
    '많은 사랑을 받고 있는 인기 상품입니다.',
    '한정 수량으로 판매됩니다. 놓치지 마세요!',
    '디테일까지 완벽하게 제작되었습니다.',
  ];
  return faker.helpers.arrayElement(sentences);
}

function getRandomCategory() {
  const category = CATEGORIES;
  return faker.helpers.arrayElement(category);
}

function getRandomStatus() {
  // const status = ['ON_SALE', 'RESERVED', 'COMPLETE'];
  const status = PRODUCT_STATUS;
  return faker.helpers.arrayElement(status);
}

async function main() {
  console.log('Creating 30 users...');

  const hashedPassword = bcrypt.hashSync('password123', 10);
  const userIds = [];

  const uniqueNicknames = new Set();
  while (uniqueNicknames.size < 30) {
    uniqueNicknames.add(faker.animal.petName({ min: 2, max: 10 }));
  }
  const nicknames = Array.from(uniqueNicknames);

  for (let i = 0; i < 30; i++) {
    const nickname = nicknames[i];
    const createdAt = faker.date.past({ years: 2 });
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({
          nickname,
          firstName: faker.person.firstName(),
        }),
        nickname,
        password: hashedPassword,
        address: faker.location.streetAddress(true),
        createdAt,
        updatedAt,
        userPreference: {
          create: {
            receiveEmail: faker.datatype.boolean(),
          },
        },
      },
    });
    userIds.push(user.id);
  }
  console.log('Users created');

  console.log('Creating 100 products...');
  for (let i = 1; i <= 200; i++) {
    const createdAt = faker.date.past({ years: 2 });
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
    await prisma.product.create({
      data: {
        name: getRandomProductName(),
        description: getRandomDescription(),
        category: getRandomCategory(),
        price: faker.number.int({ min: 1000, max: 200000 }),
        stock: faker.number.int({ min: 1, max: 10 }),
        status: getRandomStatus(),
        createdAt,
        updatedAt,
        authorId: faker.helpers.arrayElement(userIds),
      },
    });
  }
  console.log('Products created.');

  console.log('Creating 100 articles...');
  for (let i = 1; i <= 100; i++) {
    const randomUserIndex = getRandomInt(userIds.length);
    const randomAuthorId = userIds[randomUserIndex];
    const createdAt = faker.date.past({ years: 2 });
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

    await prisma.article.create({
      data: {
        title: faker.lorem.sentence({ min: 3, max: 7 }),
        content: faker.lorem.paragraph(2),
        createdAt,
        updatedAt,
        authorId: randomAuthorId,
      },
    });
  }
  console.log('Articles created.');

  console.log('Seeding finished');
}

main()
  .catch((e) => {
    console.error(`시드 생성중 오류:`, e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
