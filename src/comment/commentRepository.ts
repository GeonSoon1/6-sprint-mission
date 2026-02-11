import { prismaClient, Prisma } from '../libs/constants';

async function findAll(take: number, cursor: number | undefined, productId: number | undefined, articleId: number | undefined) {
    const whereClause: Prisma.CommentWhereInput = {};

    if (productId) {
        whereClause.productId = productId;
    } else if (articleId) {
        whereClause.articleId = articleId;
    }

    const findOptions: Prisma.CommentFindManyArgs = {
        take: take,
        where: whereClause,
        orderBy: {
            createdAt: 'desc',
        },
    };

    if (cursor) {
        findOptions.skip = 1;
        findOptions.cursor = {
            id: cursor,
        };
    }

    return prismaClient.comment.findMany(findOptions);
}

async function findById(id: number) {
    return prismaClient.comment.findUniqueOrThrow({
        where: { id },
    });
}

async function create(content: string, userId: number, productId?: number, articleId?: number) {
    return prismaClient.comment.create({
        data: {
            content,
            userId,
            productId,
            articleId,
        },
    });
}

async function update(id: number, content: string) {
    return prismaClient.comment.update({
        where: { id },
        data: { content },
    });
}

async function deleteComment(id: number) {
    return prismaClient.comment.delete({
        where: { id },
    });
}
// [추가] 상품 주인 찾기
async function findProductOwner(productId: number) {
    return prismaClient.product.findUnique({
        where: { id: productId },
        select: { userId: true, name: true } // 주인 ID와 상품명만 가져옴
    });
}

// [추가] 아티클 주인 찾기
async function findArticleOwner(articleId: number) {
    return prismaClient.article.findUnique({
        where: { id: articleId },
        select: { userId: true, title: true } // 주인 ID와 제목만 가져옴
    });
}

// [추가] 알림 생성
async function createNotification(userId: number, content: string) {
    return prismaClient.notification.create({
        data: {
            userId,
            content,
            isRead: false,
        }
    });
}
export default {
    findAll,
    findById,
    create,
    update,
    findProductOwner,
    findArticleOwner,
    createNotification,
    delete: deleteComment,
};