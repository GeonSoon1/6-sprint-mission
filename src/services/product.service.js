import NotFoundError from "../errors/NotFoundError";
import ForbiddenError from "../errors/ForbiddenError";

import * as productRepo from "../repositories/product.repo";
import * as userRepo from "../repositories/user.repo";
import * as productLikeRepo from "../repositories/productLike.repo";
import * as notificationRepo from "../repositories/notification.repo";
import { getIO } from "../socket";

export async function createProduct(data, user) {
  return productRepo.createProduct(data, user.id);
}

// 단건 조회: 로그인 유저가 좋아요 눌렀는지 isLiked 포함
export async function getProduct(id, userIdOrNull = null) {
  const product = await productRepo.getProductById(id);
  if (!product) throw new NotFoundError("해당하는 상품이 없습니다.");

  let isLiked = false;
  if (userIdOrNull) {
    const like = await productLikeRepo.findProductLike(userIdOrNull, id);
    isLiked = !!like;
  }

  return { ...product, isLiked };
}

// 상품 수정: 가격이 변동되면 좋아요한 유저에게 알림 저장 + 실시간 전송
export async function updateProduct(id, data, user) {
  const existing = await productRepo.getProductById(id);
  if (!existing) throw new NotFoundError("해당하는 상품이 없습니다.");
  if (existing.userId !== user.id) {
    throw new ForbiddenError("상품을 수정 할 권한이 없습니다.");
  }

  const updated = await productRepo.updateProduct(id, data);

  // 가격 변동 알림
  if (typeof data.price === "number" && data.price !== existing.price) {
    const likers = await productLikeRepo.findLikerUserIds(id);

    const rows = likers
      .map((x) => x.userId)
      .filter((uid) => uid !== user.id)
      .map((uid) => ({
        userId: uid,
        type: "PRODUCT_PRICE_CHANGED",
        title: "좋아요한 상품의 가격이 변동되었어요",
        body: `${existing.name} 가격: ${existing.price} → ${data.price}`,
        productId: id,
        articleId: null,
        isRead: false,
      }));

    if (rows.length) {
      // DB 저장
      await notificationRepo.createManyNotifications(rows);

      // 실시간 전송 (간단 payload)
      const io = getIO();
      for (const r of rows) {
        io.to(`user:${r.userId}`).emit("notification:new", r);
      }
    }
  }

  return updated;
}

export async function deleteProduct(id, user) {
  const existing = await productRepo.getProductById(id);
  if (!existing) throw new NotFoundError("해당하는 상품이 없습니다.");
  if (existing.userId !== user.id) {
    throw new ForbiddenError("상품을 삭제 할 권한이 없습니다.");
  }
  return productRepo.deleteProduct(id);
}

export async function getMyProduct(user) {
  const existingUser = await userRepo.getUserById(user.id);
  if (!existingUser) throw new NotFoundError("유저를 찾을 수 없습니다.");
  return productRepo.getMyProduct(existingUser.id);
}
