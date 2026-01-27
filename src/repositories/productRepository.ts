import { prismaClient } from '../libs/constants';
import { ProductPublicData, ProductFindOptions, UpdateProductData } from './../libs/interfaces';


async function findByIdSimple(id: number) {
    return prismaClient.product.findUnique({
        where: { id },
    });
}
async function findLikers(productId: number) {
    return prismaClient.productLike.findMany({
        where: { productId },
        select: { userId: true } // 유저 ID만 쏙 뽑아옵니다.
    });
}
async function createNotification(userId: number, content: string) {
    return prismaClient.notification.create({
        data: {
            userId,
            content,
            isRead: false, // 안 읽음 상태로 생성
        }
    });
}
async function findByUserId(userId: number) {
    return prismaClient.product.findMany({
        where: {
            id: userId,
        },
    });
}

async function findById(id: number, userId?: number) {
    const include = {
        productLikes: userId ? { where: { userId } } : false,
    };
    return prismaClient.product.findUniqueOrThrow({
        where: {
            id,
        },
        include,
    });
}

async function findAll(findOptions: ProductFindOptions, userId: number) {
    const include = {
        productLikes: userId ? { where: { userId } } : false,
    };
    return prismaClient.product.findMany({
        ...findOptions,
        include,
    });
}

async function update(id: number, data: UpdateProductData) {
    const { comments, productLikes, ...updateData } = data;
    return prismaClient.product.update({
        where: {
            id,
        },
        data: updateData,
    });
}

async function create(userFields: ProductPublicData) {
    const { comments, productLikes, ...NewuserFields } = userFields;
    return await prismaClient.product.create({
        data: {
            ...NewuserFields,
        },
    });
}

async function ondelete(id: number) {
    return await prismaClient.product.delete({
        where: {
            id,
        },
    });
}

export default {
    findById,
    findAll,
    update,
    create,
    ondelete,
    findByUserId,
    findByIdSimple,
    findLikers,
    createNotification
};
