import prisma from '../lib/prismaclient.js';

//user가 생성한 product list 확인
export async function getUserCreatedProductsList(req, res) {
  const userId = req.user.id;

  // user 검증
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // 리스트 검색 조건
  const {
    sort = 'newest',
    limit = 10,
    offset = 0,
    name = '',
    description = '',
  } = req.query;

  let orderBy;
  switch (sort) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const productList = await prisma.product.findMany({
    where: {
      userId,
      name: { contains: name },
      description: { contains: description },
    },
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy,
  });

  if (!productList || productList.length === 0)
    return res.status(401).json({ message: 'cannot find list' });

  res.status(200).json(productList);
}

//user가 생성한 article list 확인
export async function getUserCreatedArticlesList(req, res) {
  const userId = req.user.id;

  // user 검증
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // 리스트 검색 조건
  const {
    sort = 'newest',
    limit = 10,
    offset = 0,
    title = '',
    content = '',
  } = req.query;

  let orderBy;
  switch (sort) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const articleList = await prisma.article.findMany({
    where: {
      userId,
      title: { contains: title },
      content: { contains: content },
    },
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy,
  });

  if (!articleList || articleList.length === 0)
    return res.status(401).json({ message: 'cannot find list' });

  res.status(200).json(articleList);
}
