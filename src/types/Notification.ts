type NotificationType = 'PRODUCT_PRICE_CHANGE' | 'ARTICLE_COMMENT';

interface Notification {
  id: number;
  type: NotificationType;
  content: string;
  isRead: boolean;
  readAt?: Date | null;
  userId: number;
  articleId?: number | null;
  productId?: number | null;
  commentId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type { NotificationType };
export default Notification;
