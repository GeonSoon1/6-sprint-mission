import { prismaClient } from '../libs/constants';

async function findAll(userId: number) {
    return prismaClient.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}

async function countUnread(userId: number) {
    return prismaClient.notification.count({
        where: {
            userId,
            isRead: false,
        },
    });
}

async function findById(id: number) {
    return prismaClient.notification.findUnique({
        where: { id },
    });
}

async function markAsRead(id: number) {
    return prismaClient.notification.update({
        where: { id },
        data: { isRead: true },
    });
}

export default {
    findAll,
    countUnread,
    findById,
    markAsRead,
};