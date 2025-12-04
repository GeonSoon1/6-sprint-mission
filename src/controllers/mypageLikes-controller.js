import prisma from '../lib/prismaclient.js';

export async function getUserlikedProductsList(req, res) {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const productLikeDB = await prisma.productLikes.findMany({
    where: { userId },
  });

  if (productLikeDB.length === 0)
    return res.status(401).json({ message: 'cannot find like product' });

  const productLikeIds = productLikeDB.map((item) => item.productId);

  let likeProductList = [];

  for (const id of productLikeIds) {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    likeProductList.push(product);
  }

  return res.status(200).json(likeProductList);
}

export async function getUserlikedArticlesList(req, res) {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const articleLikeDB = await prisma.articleLikes.findMany({
    where: { userId },
  });

  if (articleLikeDB.length === 0)
    return res.status(401).json({ message: 'cannot find like article' });

  const articleLikeIds = articleLikeDB.map((item) => item.articleId);

  let likeArticleList = [];

  for (const id of articleLikeIds) {
    const article = await prisma.article.findUnique({
      where: { id },
    });
    likeArticleList.push(article);
  }

  return res.status(200).json(likeArticleList);
}
