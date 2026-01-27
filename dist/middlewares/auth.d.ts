import { ExpressHandler, ExpressRequest, ExpressResponse, ExpressNextFunction } from '../libs/constants';
declare function verifyProduectAuth(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction): Promise<void>;
declare function verifyArticleAuth(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction): Promise<void>;
declare const _default: {
    verifyAccessToken: ExpressHandler;
    softVerifyAccessToken: ExpressHandler;
    verifyProduectAuth: typeof verifyProduectAuth;
    verifyArticleAuth: typeof verifyArticleAuth;
    verifyRefreshToken: ExpressHandler;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map