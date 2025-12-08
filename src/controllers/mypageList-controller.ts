import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';

//user가 생성한 product list 확인
export async function getUserCreatedProductsList(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const userId = req.user.id;

  // user 검증
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // 리스트 검색 조건
  const name = String(req.query.name ?? '');
  const description = String(req.query.description ?? '');
  const limit = Number(req.query.limit ?? 10);
  const offset = Number(req.query.offset ?? 0);
  const sort = String(req.query.sort ?? 'newest');

  let orderBy: { createdAt: 'asc' | 'desc' };
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
    skip: offset,
    take: limit,
    orderBy,
  });

  if (!productList || productList.length === 0)
    return res.status(401).json({ message: 'cannot find list' });

  res.status(200).json(productList);
}

//user가 생성한 article list 확인
export async function getUserCreatedArticlesList(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const userId = req.user.id;

  // user 검증
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // 리스트 검색 조건
  const title = String(req.query.name ?? '');
  const content = String(req.query.description ?? '');
  const limit = Number(req.query.limit ?? 10);
  const offset = Number(req.query.offset ?? 0);
  const sort = String(req.query.sort ?? 'newest');

  let orderBy: { createdAt: 'asc' | 'desc' };
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
    skip: offset,
    take: limit,
    orderBy,
  });

  if (!articleList || articleList.length === 0)
    return res.status(401).json({ message: 'cannot find list' });

  res.status(200).json(articleList);
}
