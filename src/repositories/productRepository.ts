import { prismaClient } from '../libs/constants';
import { ProductPublicData, ProductFindOptions, UpdateProductData } from './../libs/interfaces';




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
    findByUserId
};
