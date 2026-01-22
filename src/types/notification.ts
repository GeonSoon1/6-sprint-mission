export const NOTIFICATION_TYPES = {
  PRICE_CHANGED: 'PRICE_CHANGED',
  NEW_COMMENT: 'NEW_COMMENT',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
