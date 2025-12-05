import prisma from '../lib/prismaclient.js';

export async function createArticleComment(req, res) {
  // article이 DB에 있는지 확인
  const articleId = Number(req.params.articleId);
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(404).json({ message: 'Cannot found article' });

  // user가 DB에 존재 하는지 확인
  const userId = req.user.id;
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  const { content } = req.body;
  const commentCreate = await prisma.commentArticle.create({
    data: {
      content,
      userId,
      articleId,
    },
    include: {
      article: true,
    },
  });

  res.status(201).json(commentCreate);
}

export async function getArticleCommentsList(req, res) {
  const articleId = Number(req.params.articleId);
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(404).json({ message: 'Cannot found article' });

  const articleComments = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!articleComments)
    return res.status(404).json({ message: 'Cannot found Article comment' });

  res.status(200).json(articleComments.comments);
}

export async function updateArticleComment(req, res) {
  // article이 DB에 있는지 확인
  const articleId = Number(req.params.articleId);
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(404).json({ message: 'Cannot found article' });

  // user가 DB에 존재 하는지 확인
  const userId = req.user.id;
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  // comment가 DB에 존재 하는지 확인
  const commentId = Number(req.params.commentId);
  const comment = await prisma.commentArticle.findUnique({
    where: { id: commentId },
  });

  if (!comment)
    return res.status(404).json({ message: 'Cannot found comment' });

  // DB에 있는 comment userID 정보와 로그인 한 User 정보가 같은지 확인
  if (comment.userId !== userId)
    return res.status(401).json({ message: 'Unauthorized' });

  const commentUpdate = await prisma.commentArticle.update({
    where: { id: commentId },
    data: req.body,
  });

  res.status(201).json(commentUpdate);
}

export async function deleteArticleComment(req, res) {
  // article이 DB에 있는지 확인
  const articleId = Number(req.params.articleId);
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(404).json({ message: 'Cannot found article' });

  // user가 DB에 존재 하는지 확인
  const userId = req.user.id;
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  // comment가 DB에 존재 하는지 확인
  const commentId = Number(req.params.commentId);
  const comment = await prisma.commentArticle.findUnique({
    where: { id: commentId },
  });

  if (!comment)
    return res.status(404).json({ message: 'Cannot found comment' });

  // DB에 있는 comment userID 정보와 로그인 한 User 정보가 같은지 확인
  if (comment.userId !== userId)
    return res.status(401).json({ message: 'Unauthorized' });

  await prisma.commentArticle.delete({
    where: { id: commentId },
  });

  res.status(204).json({ message: '삭제 완료' });
}
