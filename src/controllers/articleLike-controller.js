import prisma from '../lib/prismaclient.js';

export async function likeCountUp(req, res) {
  const articleId = Number(req.params.id);
  const userId = req.user.id;

  // 제품 검증
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(401).json({ message: 'Cannot found article' });

  // user 검증
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // 이미 likeCount 증가 했다면 작업 종료
  const readArticleLikeCount = await prisma.articleLikes.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  if (readArticleLikeCount && readArticleLikeCount.likeCountBool)
    return res.status(401).json({ message: '이미 좋아요를 눌렀습니다' });

  // likeCount 증가 작업
  const upArticleLikeCount = article.likeCount + 1;

  const updateArticleLikesCount = await prisma.article.update({
    where: { id: articleId },
    data: { likeCount: Number(upArticleLikeCount) },
  });

  // articleLikes DB에 기록
  let updateArticleLikesDB;

  if (readArticleLikeCount && !readArticleLikeCount.likeCountBool) {
    updateArticleLikesDB = await prisma.articleLikes.update({
      where: { id: readArticleLikeCount.id },
      data: { likeCountBool: true },
    });
  } else {
    updateArticleLikesDB = await prisma.articleLikes.create({
      data: {
        userId,
        articleId,
      },
    });
  }

  res.status(200).json({ updateArticleLikesCount, updateArticleLikesDB });
}

export async function likeCountDown(req, res) {
  const articleId = Number(req.params.id);
  const userId = req.user.id;

  // 제품 검증
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(401).json({ message: 'Cannot found article' });

  // likeCount가 0 이하일 경우
  if (article.likeCount < 1)
    return res.status(401).json({ message: '더 이상 감소할 수 없습니다' });

  // user 검증
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // 이미 likeCount 감소 했다면 작업 종료
  const readArticleLikeCount = await prisma.articleLikes.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  const articleLikeCount = readArticleLikeCount.likeCountBool;

  if (!readArticleLikeCount || !articleLikeCount)
    return res.status(401).json({ message: '작업을 진행 할 수 없습니다' });

  // likeCount 감소 작업
  const downArticleLikeCount = article.likeCount - 1;

  const updateArticleLikeCount = await prisma.article.update({
    where: { id: articleId },
    data: { likeCount: Number(downArticleLikeCount) },
  });

  // articleLikes DB에 기록
  const updateArticleLikesDB = await prisma.articleLikes.update({
    where: { id: readArticleLikeCount.id },
    data: { likeCountBool: false },
  });

  res.status(200).json({ updateArticleLikeCount, updateArticleLikesDB });
}
