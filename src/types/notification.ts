import { NotificationType } from '@prisma/client';

export type Notification = {
  id: number;
  userId: number;
  type: NotificationType;
  targetId: number;
  isRead: boolean;
  createdAt: Date;
  readAt: Date | null;
};

export type NotificationCreate = {
  userId: number;
  type: NotificationType;
  targetId: number;
};
