import { NotificationRepository } from '../notifications/notification.repository';
export declare class NotificationService {
    private repo;
    constructor(repo: NotificationRepository);
    create(userId: string, message: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        isRead: boolean;
    }>;
    getMyNotifications(user: {
        id: string;
    }, query: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(user: {
        id: string;
    }): Promise<number>;
    readNotification(id: string, user: {
        id: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
//# sourceMappingURL=notification.service.d.ts.map