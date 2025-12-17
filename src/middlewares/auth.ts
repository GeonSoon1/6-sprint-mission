import { expressjwt } from 'express-jwt';
import productRepository from '../repositories/productRepository';
import articleRepository from '../repositories/articleRepository';
import { CustomError } from '../libs/Handler/errorHandler';
import { ExpressHandler, ExpressRequest, ExpressResponse, ExpressNextFunction } from '../libs/constants';
import jwt, { JwtPayload } from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
}

const verifyAccessToken: ExpressHandler = expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'user'
});

const softVerifyAccessToken: ExpressHandler = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (!err && decoded && typeof decoded === 'object') {
                req.user = decoded as (JwtPayload & { userId: number; });
            }
            next();
        });
    } else {
        next();
    }
};

const verifyRefreshToken: ExpressHandler = expressjwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.refreshToken,
});

async function verifyProduectAuth
    (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
    const id = req.params.id || "";
    if (!id) throw new CustomError(404, "id가 비 정상적인 값 입니다");
    const idtoNumber = parseInt(id);
    const product = await productRepository.findById(idtoNumber);
    if (!product) {
        throw new CustomError(404, 'product not found');
    }
    if (typeof req.user !== 'object' || req.user.userId === undefined || product.id !== req.user.userId) {
        throw new CustomError(403, 'Forbidden');
    }
    return next();
};

async function verifyArticleAuth(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {

    const id = req.params.id;
    if (!id) throw new CustomError(404, "id가 비 정상적인 값 입니다");
    const idtoNumber = parseInt(id);
    const article = await articleRepository.findById(idtoNumber);
    if (!article) {
        throw new CustomError(404, 'article not found');
    }
    if (typeof req.user !== 'object' || req.user.userId === undefined || article.id !== req.user.userId) {
        throw new CustomError(403, 'Forbidden');
    }
    return next();
}

export default {
    verifyAccessToken,
    softVerifyAccessToken,
    verifyProduectAuth,
    verifyArticleAuth,
    verifyRefreshToken,
};