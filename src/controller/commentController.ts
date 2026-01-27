import { assert } from 'superstruct';
import { CreateComment, PatchComment } from '../structs/structs';
import { ExpressRequest, ExpressResponse } from '../libs/constants';
import { CustomError } from '../libs/Handler/errorHandler';
import { commentService } from '../services/commentService';

export async function GetComment(req: ExpressRequest, res: ExpressResponse) {
    const { take = '10', cursor, productId, articleId } = req.query;
    const parsedTake = parseInt(take as string, 10) || 0;

    if (isNaN(parsedTake) || parsedTake <= 0) {
        throw new CustomError(400, 'Invalid "take" parameter.');
    }

    const parsedCursor = cursor ? parseInt(cursor as string, 10) : undefined;
    const parsedProductId = productId ? Number(productId) : undefined;
    const parsedArticleId = articleId ? Number(articleId) : undefined;

    const result = await commentService.getComments(parsedTake, parsedCursor, parsedProductId, parsedArticleId);
    res.status(200).json(result);
}


export async function GetCommentById(req: ExpressRequest, res: ExpressResponse) {
    const { id } = req.params;
    const parsedId = parseInt(id as string, 10) || null;
    if (!parsedId) throw new CustomError(404, "id Not Found");
    const comment = await commentService.getCommentById(parsedId);
    res.send(comment);
}


export async function PostComment(req: ExpressRequest, res: ExpressResponse) {
    assert(req.body, CreateComment);
    const { content, productId, articleId } = req.body;
    const userId = req.user?.userId;
    if (!userId) throw new CustomError(401, 'Unauthorized');
    // 서비스 호출 (userId 추가됨)
    const { comment, notification } = await commentService.createComment(userId, content, productId, articleId);

    // [알림 발송] 알림이 생성되었다면 소켓으로 전송
    if (notification) {
        const io = req.app.get('io'); // app.js에서 설정한 io 객체 가져오기
        if (io) {
            // 알림 받을 사람(notification.userId)에게만 전송
            io.to(notification.userId).emit('notification', notification);
        }
    }

    // 클라이언트에는 댓글 정보만 주거나, 필요하면 알림 생성 여부도 줄 수 있음
    res.status(201).send(comment);
}

export async function PatchCommentById(req: ExpressRequest, res: ExpressResponse) {
    assert(req.body, PatchComment);
    const { content } = req.body;
    const { id } = req.params;
    const parsedId = parseInt(id as string, 10) || null;
    if (!parsedId) throw new CustomError(404, "id Not Found");
    if (!content) throw new CustomError(404, "Request body is empty");

    const comment = await commentService.updateComment(parsedId, content);
    res.send(comment);
}

export async function DeleteCommentById(req: ExpressRequest, res: ExpressResponse) {
    const { id } = req.params;
    const parsedId = parseInt(id as string, 10) || null;
    if (!parsedId) throw new CustomError(404, "id Not Found");
    const comment = await commentService.deleteComment(parsedId);
    res.send(comment);
}
