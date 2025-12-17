import { prismaClient, Prisma } from '../libs/constants';
import { assert } from 'superstruct';
import { CreateComment, PatchComment } from '../structs/structs';
import { ExpressRequest, ExpressResponse } from '../libs/constants';
import { CustomError } from '../libs/Handler/errorHandler';



export async function GetComment(req: ExpressRequest, res: ExpressResponse) {
    const { take = '10', cursor, productId, articleId } = req.query;
    const parsedTake = parseInt(take as string, 10) || 0;

    if (isNaN(parsedTake) || parsedTake <= 0) {
        return res.status(400).send({ error: 'Invalid "take" parameter.' });
    }

    const whereClause: Prisma.CommentWhereInput = {};

    if (productId) {
        whereClause.productId = Number(productId); // 상품 ID로 필터링
    } else if (articleId) {
        whereClause.articleId = Number(articleId); // 게시글 ID로 필터링
    }

    const findOptions: Prisma.CommentFindManyArgs = {
        take: parsedTake,
        where: whereClause,
        orderBy: {
            createdAt: 'desc',
        },
    };

    if (cursor) {
        const parsedCursor = parseInt(cursor as string, 10);

        findOptions.skip = 1;
        findOptions.cursor = {
            id: parsedCursor,
        };
    }

    const comments = await prismaClient.comment.findMany(findOptions); // 
    let nextCursor = null;
    if (comments.length > 0 && comments.length === parsedTake) {
        nextCursor = comments[comments.length - 1]!.id;
    }
    res.status(200).json({
        comments,
        nextCursor,
    });

}


export async function GetCommentById(req: ExpressRequest, res: ExpressResponse) {
    const { id } = req.params;
    const paesedId = parseInt(id as string, 10) || null;
    if (!paesedId) return new CustomError(404, "id Not Found");
    const Comment = await prismaClient.comment.findUniqueOrThrow({
        where: {
            id: paesedId
        },
    });
    res.send(Comment);
}


export async function PostComment(req: ExpressRequest, res: ExpressResponse) {
    assert(req.body, CreateComment);
    const { content, productId, articleId } = req.body;
    if ((productId && articleId) || (!productId && !articleId)) {
        return res.status(400).json({
            error: 'Comment must belong to EITHER a Product OR an Article.',
        });
    }
    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Content cannot be empty.' });
    }

    const comment = await prismaClient.comment.create({
        data: {
            content: content,
            productId: productId,
            articleId: articleId,
        },
    });
    res.status(201).send(comment);
}

export async function PatchCommentById(req: ExpressRequest, res: ExpressResponse) {
    assert(req.body, PatchComment);
    const { content } = req.body;
    const { id } = req.params;
    const paesedId = parseInt(id as string, 10) || null;
    if (!paesedId) return new CustomError(404, "id Not Found");
    if (content !== undefined && content.trim() === '') {
        return res.status(400).json({ error: 'Content cannot be empty.' });
    }

    const comment = await prismaClient.comment.update({
        where: {
            id: paesedId
        },
        data: {
            content: content,
        },
    });
    res.send(comment);
}

export async function DeleteCommentById(req: ExpressRequest, res: ExpressResponse) {
    const { id } = req.params;
    const paesedId = parseInt(id as string, 10) || null;
    if (!paesedId) return new CustomError(404, "id Not Found");
    const Comment = await prismaClient.comment.delete({
        where: {
            id: paesedId
        },
    });
    res.send(Comment);
}


