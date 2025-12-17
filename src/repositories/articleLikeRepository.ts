import { prismaClient } from '../libs/constants';

async function find(userId: number, articleId: number) {
    return prismaClient.articleLike.findUnique({
        where: {
            userId_articleId: {
                userId,
                articleId,
            },
        },
    });
}

async function create(userId: number, articleId: number) {
    return prismaClient.articleLike.create({
        data: {
            userId,
            articleId,
        },
    });
}

async function remove(id: number) {
    return prismaClient.articleLike.delete({
        where: {
            id,
        },
    });
}

export default {
    find,
    create,
    remove,
};
