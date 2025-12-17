import { prismaClient } from '../libs/constants';
import {
    ArticlePublicData,
    ArticleFindOptions,
    UpdateArticleData,
} from '../libs/interfaces';

async function findById(id: number, userId?: number) {
    const include = {
        articleLikes: userId ? { where: { userId } } : false,
    };
    return prismaClient.article.findUniqueOrThrow({
        where: {
            id,
        },
        include,
    });
}

async function findAll(findOptions: ArticleFindOptions, userId: number) {
    const include = {
        articleLikes: userId ? { where: { userId } } : false,
    };

    return prismaClient.article.findMany({
        ...findOptions,
        include,
    });
}

async function create(userFields: ArticlePublicData) {
    const { comments, articleLikes, ...NewuserFields } = userFields;

    return await prismaClient.article.create({
        data: {
            ...NewuserFields,
        },
    });
}

async function update(id: number, data: UpdateArticleData) {
    const { comments, articleLikes, ...updateData } = data;
    return prismaClient.article.update({
        where: {
            id,
        },
        data: updateData,
    });
}

async function ondelete(id: number) {
    return await prismaClient.article.delete({
        where: {
            id,
        },
    });
}

export default {
    findById,
    findAll,
    create,
    update,
    ondelete,
};
