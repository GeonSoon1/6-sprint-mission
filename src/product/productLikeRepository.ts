import { prismaClient } from '../libs/constants';

async function find(userId: number, productId: number) {
    return prismaClient.productLike.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });
}

async function create(userId: number, productId: number) {
    return prismaClient.productLike.create({
        data: {
            userId,
            productId,
        },
    });
}

async function remove(id: number) {
    return prismaClient.productLike.delete({
        where: {
            id,
        },
    });
}

async function findLikedProductsByUserId(userId: number) {
    return prismaClient.productLike.findMany({
        where: {
            userId,
        },
        include: {
            product: true,
        },
    });
}

export default {
    find,
    create,
    remove,
    findLikedProductsByUserId,
};
