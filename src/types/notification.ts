export interface AuthPayload {
  id: number;
  email: string;
}

export interface NotificationData {
  id?: number;
  type: 'COMMENT' | 'PRICE_CHANGE';
  content: string;
  link?: string;
  articleId?: number;
  productId?: number;
  createdAt?: Date;
}
