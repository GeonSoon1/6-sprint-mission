import { prisma } from "./lib/prisma.js";
import { getIO } from "./socket.js";

export async function updateProduct(productId, data, user) {
  const existing = await productRepo.getProductById(id);
  if (!existing) throw new NotFoundError("해당하는 상품이 없습니다.");
  if (existing.userId !== user.id) {
    throw new ForbiddenError("상품을 수정 할 권한이 없습니다.");
  }

  const updated = await productRepo.updateProduct(productId, data);

  if (typeof data.price === 'number' && data.price !==existing.price) {
    const likers = await productLikeRepo.findLikerUserIds(productId)
    const userIds = likers.map(x => x.userId)
    const targets = userIds.filter(uid => uid !== user.id)
    
    const rows = targets.map(uid => ({
      userId: uid,
      type: "PRODUCT_PRICE_CHANGED",
      title: "좋아요한 상품의 가격이 변동되었습니다.",
      body: `${existing.name} 가격: ${existing.price} -> ${data.price}`,
      productId, productId,
      articleId: null,
      isRead: false,
    }));

    if (rows.length) {
      await NotificationRepo.createManyNotifications(rows)

      const io = getIO()
      for (const r of rows) {
        io.to(`user:${r.userId}`).emit("notification:news", r)
      }
    }
  }
  return updated
}


export async function findLikerUserIds(productId) {
  return await prisma.productLike.findMany({
    where: { productId },
    select: { userId : true }
  })
}

export async function createManyNotifications(data) {
  return await prisma.notification.createMany( { data })
}


export async function createComment(data, user) {
  if (!data.productId && !data.articleId) {
    throw new BadRequestError("productId 또는 articleId 중 하나는 존재해야합니다.");
  }

  if (data.productId && data.articleId) {
    throw new BadRequestError("productId와 articleId를 동시에 입력 할 수 없습니다.");
  }


  if (data.productId) {
    const product = await productRepo.getProductById(data.productId);
    if (!product) {
      throw new NotFoundError("상품을 찾을 수 없습니다.");
    }
  }

  let article = null;
  if (data.articleId) {
    article = await articleRepo.getArticleById(data.articleId);
    if (!article) throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  const comment = await commentRepo.createComment({
    content: data.content,
    userId: user.id,
    productId: data.productId ?? null,
    articleId: data.articleId ?? null,
  })

  if (article && article.userId !== user.id) {
    const n = await NotificationRepo.createNotification({
      userId: article.userId,
      type: 'ARTICLE_COMMENTED',
      title: '게시글에 새 댓글이 달렸어요.',
      body: `${article.title}에 댓글이 달렸습니다.`,
      articleId: article.id,
      productId: null,
      isRead: false
    })
    
    const io = getIO()
    io.to(`user:${article.userId}`).emit("notification:new", n)
  }
}

