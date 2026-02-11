export declare class NotificationRepository {
    create(userId: string, message: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        isRead: boolean;
    }>;
    findByUserId(query: {
        userId: string;
        cursor?: string;
        limit?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        isRead: boolean;
    }[]>;
    countUnread(userId: string): Promise<number>;
    updateRead(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
//# sourceMappingURL=notification.repository.d.ts.map