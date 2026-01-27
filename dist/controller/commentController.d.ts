import { ExpressRequest, ExpressResponse } from '../libs/constants';
import { CustomError } from '../libs/Handler/errorHandler';
export declare function GetComment(req: ExpressRequest, res: ExpressResponse): Promise<ExpressResponse | undefined>;
export declare function GetCommentById(req: ExpressRequest, res: ExpressResponse): Promise<CustomError | undefined>;
export declare function PostComment(req: ExpressRequest, res: ExpressResponse): Promise<ExpressResponse | undefined>;
export declare function PatchCommentById(req: ExpressRequest, res: ExpressResponse): Promise<ExpressResponse | CustomError | undefined>;
export declare function DeleteCommentById(req: ExpressRequest, res: ExpressResponse): Promise<CustomError | undefined>;
//# sourceMappingURL=commentController.d.ts.map