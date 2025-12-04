import prisma from '../lib/prismaclient.js';

export async function createProductComment(req, res) {
  const productId = Number(req.params.productId);
  const userId = req.user.id;

  // product가 DB에 있는지 확인
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product)
    return res.status(401).json({ message: 'Cannot found product' });

  // user가 DB에 존재 하는지 확인
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  const { content } = req.body;
  const commentCreate = await prisma.commentProduct.create({
    data: {
      content,
      userId,
      productId,
    },
    include: {
      product: true,
    },
  });

  res.status(201).json(commentCreate);
}

export async function getProductCommentList(req, res) {
  const productId = Number(req.params.productId);
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product)
    return res.status(404).json({ message: 'Cannot found Product' });

  const productComments = await prisma.product.findUnique({
    where: { id: productId },
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

  if (!productComments)
    return res.status(404).json({ message: 'Cannot found Product comment' });

  res.status(200).json(productComments.comments);
}

export async function updateProductComment(req, res) {
  const productId = Number(req.params.productId);
  const userId = req.user.id;

  // product가 DB에 있는지 확인
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product)
    return res.status(401).json({ message: 'Cannot found product' });

  // user가 DB에 존재 하는지 확인
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  // comment가 DB에 존재 하는지 확인
  const commentId = Number(req.params.commentId);
  const comment = await prisma.commentProduct.findUnique({
    where: { id: commentId },
  });
  if (!comment)
    return res.status(404).json({ message: 'Cannot found comment' });

  // DB에 있는 comment userID 정보와 로그인 한 User 정보가 같은지 확인
  if (comment.userId !== userId)
    return res.status(401).json({ message: 'Unauthorized' });

  const commentUpdate = await prisma.commentProduct.update({
    where: { id: commentId },
    data: req.body,
  });

  res.status(201).json(commentUpdate);
}

export async function deleteProductComment(req, res) {
  const productId = Number(req.params.productId);
  const userId = req.user.id;

  // product가 DB에 있는지 확인
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product)
    return res.status(401).json({ message: 'Cannot found product' });

  // user가 DB에 존재 하는지 확인
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  // comment가 DB에 존재 하는지 확인
  const commentId = Number(req.params.commentId);
  const comment = await prisma.commentProduct.findUnique({
    where: { id: commentId },
  });
  if (!comment)
    return res.status(404).json({ message: 'Cannot found comment' });

  // DB에 있는 comment userID 정보와 로그인 한 User 정보가 같은지 확인
  if (comment.userId !== userId)
    return res.status(401).json({ message: 'Unauthorized' });

  await prisma.commentProduct.delete({
    where: { id: commentId },
  });

  res.status(204).json({ message: '삭제 완료' });
}
