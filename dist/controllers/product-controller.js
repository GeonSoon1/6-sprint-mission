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
exports.getProductsList = getProductsList;
exports.getProductInfo = getProductInfo;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const { name, description, price, tags } = req.body;
        const productCreate = yield prismaclient_1.default.product.create({
            data: {
                name,
                description,
                price,
                tags,
                userId,
            },
            include: {
                comments: true,
            },
        });
        res.status(201).json(productCreate);
    });
}
function getProductsList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { offset, limit, name, description, orderBy } = req.validated;
        const productList = yield prismaclient_1.default.product.findMany({
            where: {
                name: { contains: name },
                description: { contains: description },
            },
            skip: offset,
            take: limit,
            orderBy,
            select: {
                id: true,
                name: true,
                price: true,
                createdAt: true,
            },
        });
        if (!productList)
            return res.status(401).json({ message: '제품 목록을 찾을 수 없습니다' });
        res.status(200).json(productList);
    });
}
function getProductInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = req.product.id;
        const product = yield prismaclient_1.default.product.findUniqueOrThrow({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true,
            },
        });
        // 현재 User가 좋아요 했는지 확인하기
        const userId = req.userId;
        const checkLiked = yield prismaclient_1.default.productLikes.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
        let isLiked = false;
        if (checkLiked) {
            isLiked = true;
        }
        res.status(200).json({ product, isLiked });
    });
}
function updateProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = req.product.id;
        const productUpdate = yield prismaclient_1.default.product.update({
            where: { id: productId },
            data: req.body,
        });
        res.status(200).json(productUpdate);
    });
}
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = req.product.id;
        yield prismaclient_1.default.product.delete({
            where: { id: productId },
        });
        res.status(204).json({ message: '삭제 완료' });
    });
}
