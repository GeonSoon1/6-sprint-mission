import prisma from '../lib/prismaclient.js';

export async function createArticle(req, res) {
  // user가 DB에 존재 하는지 확인
  const userId = req.user.id;
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  // article 저장하기
  const { title, content } = req.body;

  const articleCreate = await prisma.article.create({
    data: {
      title,
      content,
      userId,
    },
  });

  res.status(201).json(articleCreate);
}

export async function getArticlesList(req, res) {
  const {
    offset = 0,
    limit = 5,
    order = 'newest',
    title = '',
    content = '',
  } = req.query;

  let orderBy;

  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const articles = await prisma.article.findMany({
    where: {
      title: {
        contains: title,
      },
      content: {
        contains: content,
      },
    },
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!articles) return res.status(401).json({ message: 'Cannot found List' });

  res.status(200).json(articles);
}

export async function getArticleInfo(req, res) {
  const id = Number(req.params.id);
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!article) return res.status(401).json({ message: `Cannot found ${id}` });

  // 현재 User가 좋아요 했는지 확인하기
  const userId = req.user.id;

  const checkLiked = await prisma.articleLikes.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId: id,
      },
    },
  });

  let isLiked = false;
  if (checkLiked) {
    isLiked = true;
  }

  res.status(200).json({ article, isLiked });
}

export async function updateArticle(req, res) {
  const articleId = Number(req.params.id);
  const userId = req.user.id;

  // article이 DB에 있는지 확인
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(401).json({ message: 'Cannot found article' });

  // User가 DB에 존재 하는지 확인
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  // DB에 있는 article userID 정보와 로그인 한 User 정보가 같은지 확인
  if (article.userId !== userId)
    return res.status(401).json({ message: 'Unauthorized' });

  const articleUpdate = await prisma.article.update({
    where: { id: articleId },
    data: req.body,
  });

  res.status(200).json(articleUpdate);
}

export async function deleteArticle(req, res) {
  const articleId = Number(req.params.id);
  const userId = req.user.id;

  // Article이 DB에 있는지 확인
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(401).json({ message: 'Cannot found article' });

  // User가 DB에 존재 하는지 확인
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  // DB에 있는 article userID 정보와 로그인 한 User 정보가 같은지 확인
  if (article.userId !== userId)
    return res.status(401).json({ message: 'Unauthorized' });

  await prisma.article.delete({
    where: { id: articleId },
  });

  res.status(204).json({ message: '삭제 완료' });
}
