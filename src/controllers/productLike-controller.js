import prisma from '../lib/prismaclient.js';

export async function likeCountUp(req, res) {
  const productId = Number(req.params.id);
  const userId = req.user.id;

  // 제품 검증
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product)
    return res.status(401).json({ message: 'Cannot found product' });

  // user 검증
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // 이미 likeCount 증가 했다면 작업 종료
  const readProductLikeCount = await prisma.productLikes.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (readProductLikeCount && readProductLikeCount.likeCountBool)
    return res.status(401).json({ message: '이미 좋아요를 눌렀습니다' });

  // likeCount 증가 작업
  const upProductLikeCount = product.likeCount + 1;

  const updateProductLikesCount = await prisma.product.update({
    where: { id: productId },
    data: { likeCount: Number(upProductLikeCount) },
  });

  // productLikes DB에 기록
  let updateProductLikesDB;

  if (readProductLikeCount && !readProductLikeCount.likeCountBool) {
    updateProductLikesDB = await prisma.productLikes.update({
      where: { id: readProductLikeCount.id },
      data: { likeCountBool: true },
    });
  } else {
    updateProductLikesDB = await prisma.productLikes.create({
      data: {
        userId,
        productId,
      },
    });
  }

  res.status(200).json({ updateProductLikesCount, updateProductLikesDB });
}

export async function likeCountDown(req, res) {
  const productId = Number(req.params.id);
  const userId = req.user.id;

  // 제품 검증
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product)
    return res.status(401).json({ message: 'Cannot found product' });

  // likeCount가 0 이하일 경우
  if (product.likeCount < 1)
    return res.status(401).json({ message: '더 이상 감소할 수 없습니다' });

  // user 검증
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // 이미 likeCount 감소 했다면 작업 종료
  const readProductLikeCount = await prisma.productLikes.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  const productLikeCount = readProductLikeCount.likeCountBool;

  if (!readProductLikeCount || !productLikeCount)
    return res.status(401).json({ message: '작업을 진행 할 수 없습니다' });

  // likeCount 감소 작업
  const downProductLikeCount = product.likeCount - 1;

  const updateProductLikeCount = await prisma.product.update({
    where: { id: productId },
    data: { likeCount: Number(downProductLikeCount) },
  });

  // productLikes DB에 기록
  const updateProductLikesDB = await prisma.productLikes.update({
    where: { id: readProductLikeCount.id },
    data: { likeCountBool: false },
  });

  res.status(200).json({ updateProductLikeCount, updateProductLikesDB });
}
