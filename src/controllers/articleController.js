import prisma from '../libs/prismaClient.js';

async function createArticle(req, res, next) {
  const data = await prisma.article.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.status(201).json(data);
}

async function getArticles(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;
  const sort = req.query.sort || 'recent';

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const orderBy = { createdAt: sort === 'recent' ? 'desc' : 'asc' };

  const data = await prisma.article.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      articleLikeCount: true,
    },
  });

  const userId = req.auth?.userId;
  if (userId) {
    const likedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { likedArticles: true },
    });
    const likedArticles = likedUser.likedArticles.map((aid) => aid.articleId);
    const filterlikedArticles = data
      .filter((d) => likedArticles.includes(d.id))
      .map((d) => {
        const liked = { ...d, isLiked: true };
        return liked;
      });
    const filterArticles = data
      .filter((d) => !likedArticles.includes(d.id))
      .map((d) => {
        const notLiked = { ...d, isLiked: false };
        return notLiked;
      });
    const userData = [...filterlikedArticles, ...filterArticles];
    return res
      .status(200)
      .json(
        userData.sort((a, b) =>
          sort === 'recent'
            ? b.createdAt.getTime() - a.createdAt.getTime()
            : a.createdAt.getTime() - b.createdAt.getTime()
        )
      );
  } else {
    return res.status(200).json(data);
  }
}

async function getArticleById(req, res, next) {
  const { id } = req.params;
  const data = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      articleLikeCount: true,
    },
  });

  const userId = req.auth?.userId;
  if (userId) {
    const likedArticle = await prisma.likedArticle.findUnique({
      where: { userId_articleId: { userId, articleId: id } },
    });
    if (likedArticle) {
      data.isLiked = true;
    } else {
      data.isLiked = false;
    }
  }

  res.status(200).json(data);
}

async function updateArticle(req, res, next) {
  const { id } = req.params;
  const data = await prisma.article.update({
    where: { id },
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.status(200).json(data);
}

async function deleteArticle(req, res, next) {
  const { id } = req.params;
  const data = await prisma.article.delete({
    where: { id },
  });
  res.status(204).json(data);
}

export {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
