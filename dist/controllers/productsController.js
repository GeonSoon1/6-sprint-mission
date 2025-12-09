"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProductList = getProductList;
exports.createComment = createComment;
exports.getCommentList = getCommentList;
exports.likeProduct = likeProduct;
exports.dislikeProduct = dislikeProduct;
const superstruct_1 = require("superstruct");
const prismaClient_1 = require("../lib/prismaClient");
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const UnauthorizeError_1 = __importDefault(require("../lib/errors/UnauthorizeError"));
const commonStructs_1 = require("../structs/commonStructs");
const productsStruct_1 = require("../structs/productsStruct");
const commentsStruct_1 = require("../structs/commentsStruct");
//기본 주요 기능
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, description, price, tags, images } = (0, superstruct_1.create)(req.body, productsStruct_1.CreateProductBodyStruct);
        const user = req.user;
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        const product = yield prismaClient_1.prismaClient.product.create({
            data: { name, description, price, tags, images, authorId: user.id },
        });
        res.status(201).send({ message: 'product 생성됨', product });
    });
}
function getProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const user = req.user;
        const product = yield prismaClient_1.prismaClient.product.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundError_1.default('product', id);
        }
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        const isLiked = yield prismaClient_1.prismaClient.likeProduct.findFirst({
            where: { userId: user.id, productId: id },
        });
        return res.send({ product: product, isLike: Boolean(isLiked) });
    });
}
function updateProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { name, description, price, tags, images } = (0, superstruct_1.create)(req.body, productsStruct_1.UpdateProductBodyStruct);
        const user = req.user;
        const existingProduct = yield prismaClient_1.prismaClient.product.findUnique({ where: { id } });
        if (!existingProduct) {
            throw new NotFoundError_1.default('product', id);
        }
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        if (existingProduct.authorId !== user.id) {
            throw new ForbiddenError_1.default('product');
        }
        const updatedProduct = yield prismaClient_1.prismaClient.product.update({
            where: { id },
            data: { name, description, price, tags, images },
        });
        return res.send({ message: 'product 수정됨', updatedProduct });
    });
}
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const user = req.user;
        const existingProduct = yield prismaClient_1.prismaClient.product.findUnique({ where: { id } });
        if (!existingProduct) {
            throw new NotFoundError_1.default('product', id);
        }
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        if (existingProduct.authorId !== user.id) {
            throw new ForbiddenError_1.default('product');
        }
        yield prismaClient_1.prismaClient.product.delete({ where: { id } });
        return res.status(204).send({ message: 'product 삭제됨' });
    });
}
function getProductList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page, pageSize, orderBy, keyword } = (0, superstruct_1.create)(req.query, productsStruct_1.GetProductListParamsStruct);
        const where = keyword
            ? {
                OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
            }
            : undefined;
        const totalCount = yield prismaClient_1.prismaClient.product.count({ where });
        const products = yield prismaClient_1.prismaClient.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
            where,
        });
        return res.send({
            list: products,
            totalCount,
        });
    });
}
//댓글 기능
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { content } = (0, superstruct_1.create)(req.body, commentsStruct_1.CreateCommentBodyStruct);
        const user = req.user;
        const existingProduct = yield prismaClient_1.prismaClient.product.findUnique({ where: { id: productId } });
        if (!existingProduct) {
            throw new NotFoundError_1.default('product', productId);
        }
        if (!user) {
            throw new UnauthorizeError_1.default();
        }
        if (existingProduct.authorId !== user.id) {
            throw new ForbiddenError_1.default('product');
        }
        const comment = yield prismaClient_1.prismaClient.comment.create({
            data: { productId, content, authorId: user.id },
        });
        return res.status(201).send(comment);
    });
}
function getCommentList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { cursor, limit } = (0, superstruct_1.create)(req.query, commentsStruct_1.GetCommentListParamsStruct);
        const existingProduct = yield prismaClient_1.prismaClient.product.findUnique({ where: { id: productId } });
        if (!existingProduct) {
            throw new NotFoundError_1.default('product', productId);
        }
        const commentsWithCursorComment = yield prismaClient_1.prismaClient.comment.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            take: limit + 1,
            where: { productId },
        });
        const comments = commentsWithCursorComment.slice(0, limit);
        const cursorComment = commentsWithCursorComment[comments.length - 1];
        const nextCursor = cursorComment ? cursorComment.id : null;
        return res.send({
            list: comments,
            nextCursor,
        });
    });
}
//좋아요 기능
function likeProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
            if (!req.user) {
                throw new UnauthorizeError_1.default();
            }
            const userId = req.user.id;
            const like = yield prismaClient_1.prismaClient.likeProduct.create({ data: { userId, productId: id } });
            res.status(200).send({ message: 'Like!', like });
        }
        catch (err) {
            return res.status(400).send('already liked Product!');
        }
    });
}
function dislikeProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
            if (!req.user) {
                throw new UnauthorizeError_1.default();
            }
            const userId = req.user.id;
            const likeProductFind = yield prismaClient_1.prismaClient.likeProduct.findFirst({
                where: { productId: id, userId: userId },
            });
            if (!likeProductFind) {
                throw new NotFoundError_1.default('no liked Product', likeProductFind.id);
            }
            const dislikeProduct = yield prismaClient_1.prismaClient.likeProduct.delete({
                where: { id: likeProductFind.id },
            });
            res.status(200).send({ message: 'Dislike!', dislikeProduct });
        }
        catch (err) {
            return res.status(400).send('already disliked Product');
        }
    });
}
