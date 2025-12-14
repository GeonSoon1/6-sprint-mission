import prisma from '../lib/prismaClient';

export const createProductComment = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      productId: id,
      userId,
    },
  });

  res.status(201).json(comment);
};

export const createArticleComment = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      articleId: id,
      userId,
    },
  });

  res.status(201).json(comment);
};

export const getProductComments = async (req, res) => {
  const { id } = req.params;
  const { cursor, limit = 10 } = req.query;

  const comments = await prisma.comment.findMany({
    where: { productId: id },
    take: parseInt(limit),
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  res.json(comments);
};

export const getArticleComments = async (req, res) => {
  const { id } = req.params;
  const { cursor, limit = 10 } = req.query;

  const comments = await prisma.comment.findMany({
    where: { articleId: id },
    take: parseInt(limit),
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  res.json(comments);
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) {
    return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
  }

  if (comment.userId !== userId) {
    return res.status(403).json({ message: '댓글을 수정할 권한이 없습니다.' });
  }

  const updated = await prisma.comment.update({
    where: { id },
    data: { content },
  });

  res.json(updated);
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) {
    return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
  }

  if (comment.userId !== userId) {
    return res.status(403).json({ message: '댓글을 삭제할 권한이 없습니다.' });
  }

  await prisma.comment.delete({ where: { id } });
  res.sendStatus(204);
};
