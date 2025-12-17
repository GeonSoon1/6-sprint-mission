import { EXPRESS } from '../libs/constants';
import { catchAsync, catchAsyncAll } from '../libs/catchAsync';
import auth from '../middlewares/auth';
import {
    GetComment,
    PostComment,
    GetCommentById,
    PatchCommentById,
    DeleteCommentById
} from '../controller/commentController';

const commentRouter = EXPRESS.Router();

commentRouter.route('/')
    .get(catchAsync(GetComment))
    .post(auth.verifyAccessToken, catchAsync(PostComment));

commentRouter.route('/:id')
    .get(catchAsync(GetCommentById))
    .patch(auth.verifyAccessToken, catchAsyncAll(auth.verifyProduectAuth, PatchCommentById))
    .delete(auth.verifyAccessToken, catchAsyncAll(auth.verifyProduectAuth, DeleteCommentById));


export default commentRouter;