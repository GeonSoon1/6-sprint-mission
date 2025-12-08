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
        // user가 DB에 존재 하는지 확인
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!findUser)
            return res.status(401).json({ message: 'Unauthorized' });
        // product 저장하기
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
        var _a, _b, _c, _d, _e;
        const offset = Number((_a = req.query.offset) !== null && _a !== void 0 ? _a : 0);
        const limit = Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 10);
        const name = String((_c = req.query.name) !== null && _c !== void 0 ? _c : '');
        const description = String((_d = req.query.description) !== null && _d !== void 0 ? _d : '');
        const order = String((_e = req.query.order) !== null && _e !== void 0 ? _e : 'newest');
        let orderBy;
        switch (order) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'asc' };
        }
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
            return res.status(401).json({ message: 'Cannot found List' });
        res.status(200).json(productList);
    });
}
function getProductInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        const product = yield prismaclient_1.default.product.findUniqueOrThrow({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true,
            },
        });
        if (!product)
            return res.status(401).json({ message: `Cannot found ${id}` });
        // 현재 User가 좋아요 했는지 확인하기
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const checkLiked = yield prismaclient_1.default.productLikes.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId: id,
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
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const productId = Number(req.params.id);
        // product가 DB에 있는지 확인
        const product = yield prismaclient_1.default.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            return res.status(401).json({ message: 'Cannot found product' });
        // user가 DB에 존재 하는지 확인
        const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!findUser)
            return res.status(401).json({ message: 'Unauthorized' });
        // DB에 있는 product의 user정보가 로그인 한 user 인지 확인
        if (product.userId !== userId)
            return res.status(401).json({ message: 'Unauthorized' });
        // 업데이트 작업 진행
        const productUpdate = yield prismaclient_1.default.product.update({
            where: { id: productId },
            data: req.body,
        });
        res.status(200).json(productUpdate);
    });
}
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const productId = Number(req.params.id);
        // product가 DB에 있는지 확인
        const product = yield prismaclient_1.default.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            return res.status(401).json({ message: 'Cannot found product' });
        // user가 DB에 존재 하는지 확인
        const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!findUser)
            return res.status(401).json({ message: 'Unauthorized' });
        // 동일한 user 인지 확인
        if (product.userId !== userId)
            return res.status(401).json({ message: 'Unauthorized' });
        yield prismaclient_1.default.product.delete({
            where: { id: productId },
        });
        res.status(204).json({ message: '삭제 완료' });
    });
}
