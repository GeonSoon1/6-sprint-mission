import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import commentRepository from '../repository/commentRepository';
import notificationRepository from '../repository/notificationRepository';
import { Notification } from '../types/notification';
import { NotificationType } from '@prisma/client';

class NotificationService {
  // 댓글 달리면 알림 보내는 로직
  async notifyCommentCreated(commentId: number): Promise<Notification | null> {
    const articleAuthorId = await commentRepository.findArticleAuthorIdByCommentId(commentId);
    if (!articleAuthorId) {
      throw new NotFoundError('해당 댓글이 달린 게시글의 작성자를 찾을 수 없습니다.');
    }
    const commentAuthorId = await commentRepository.findCommentAuthorIdByCommentId(commentId);
    if (articleAuthorId === commentAuthorId) {
      // 작성자가 본인의 글에 댓글을 단 경우 알림을 보내지 않음
      return null;
    }
    console.log('알림을 보낼 대상 사용자 ID:', articleAuthorId);
    console.log('댓글 작성 사용자 ID:', commentAuthorId);

    const notification = await notificationRepository.createNotification({
      userId: articleAuthorId,
      type: NotificationType.COMMENT_CREATED,
      targetId: commentId,
    });
    return notification;
  }

  // 상품 가격 변경되면 알림 보내는 로직
  async notifyPriceChanged(productId: number, userId: number): Promise<Notification> {
    const notification = await notificationRepository.createNotification({
      userId: userId,
      type: NotificationType.PRICE_CHANGED,
      targetId: productId,
    });
    return notification;
  }

  // 알림 목록 조회
  async getNotifications(userId: number): Promise<Notification[]> {
    const notifications = await notificationRepository.findByUserId(userId);
    return notifications;
  }

  // 알림 읽음 처리 로직
  async markNotificationAsRead(notificationId: number, userId: number): Promise<Notification> {
    const notification = await notificationRepository.getNotification(notificationId);
    if (!notification) {
      throw new NotFoundError('해당 알림이 없습니다.');
    }
    if (notification.userId !== userId) {
      throw new UnauthorizedError('본인의 알림만 읽을 수 있습니다.');
    }
    if (notification.isRead) {
      return notification; // 이미 읽음 처리된 알림은 그대로 반환
    }

    const updatedNotification = await notificationRepository.markAsRead(notificationId);

    return updatedNotification;
  }

  // 안 읽은 알림 갯수
  async getUnreadNotificationCount(userId: number): Promise<number> {
    const count = await notificationRepository.getUnreadCountByUserId(userId);
    return count;
  }
}

export default new NotificationService();
