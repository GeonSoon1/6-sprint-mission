export const NOTIFICATION_TYPES = {
  PRICE_CHANGED: 'PRICE_CHANGED',
  NEW_COMMENT: 'NEW_COMMENT',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

interface Notification {
  id: number;
  type: NotificationType;
  content: string;
  isRead: boolean;
  userId: number;
  productId: number | null;
  articleId: number | null;
  createdAt: Date;
}

export default Notification;
export const NOTIFICATION_TYPES = {
  PRICE_CHANGED: 'PRICE_CHANGED',
  NEW_COMMENT: 'NEW_COMMENT',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

interface Notification {
  id: number;
  type: NotificationType;
  content: string;
  isRead: boolean;
  userId: number;
  productId: number | null;
  articleId: number | null;
  createdAt: Date;
}

export default Notification;
