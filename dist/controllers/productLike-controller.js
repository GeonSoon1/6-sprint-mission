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
exports.likeCountUp = likeCountUp;
exports.likeCountDown = likeCountDown;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function likeCountUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const productId = Number(req.params.id);
        // 제품 검증
        const product = yield prismaclient_1.default.product.findUnique({ where: { id: productId } });
        if (!product)
            return res.status(401).json({ message: 'Cannot found product' });
        // user 검증
        const user = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        // 이미 likeCount 증가 했다면 작업 종료
        const readProductLikeCount = yield prismaclient_1.default.productLikes.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
        if (readProductLikeCount && readProductLikeCount.likeCountBool)
            return res.status(401).json({ message: '이미 좋아요를 눌렀습니다' });
        // likeCount 증가 작업
        const upProductLikeCount = product.likeCount + 1;
        const updateProductLikesCount = yield prismaclient_1.default.product.update({
            where: { id: productId },
            data: { likeCount: Number(upProductLikeCount) },
        });
        // productLikes DB에 기록
        let updateProductLikesDB;
        if (readProductLikeCount && !readProductLikeCount.likeCountBool) {
            updateProductLikesDB = yield prismaclient_1.default.productLikes.update({
                where: { id: readProductLikeCount.id },
                data: { likeCountBool: true },
            });
        }
        else {
            updateProductLikesDB = yield prismaclient_1.default.productLikes.create({
                data: {
                    userId,
                    productId,
                },
            });
        }
        res.status(200).json({ updateProductLikesCount, updateProductLikesDB });
    });
}
function likeCountDown(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const productId = Number(req.params.id);
        // 제품 검증
        const product = yield prismaclient_1.default.product.findUnique({ where: { id: productId } });
        if (!product)
            return res.status(401).json({ message: 'Cannot found product' });
        // likeCount가 0 이하일 경우
        if (product.likeCount < 1)
            return res.status(401).json({ message: '더 이상 감소할 수 없습니다' });
        // user 검증
        const user = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        // 이미 likeCount 감소(삭제) 했다면 작업 종료
        const readProductLikeCount = yield prismaclient_1.default.productLikes.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
        if (!readProductLikeCount)
            return res.status(401).json({ message: '이미 취소 하였습니다' });
        // likeCount 감소 작업
        const downProductLikeCount = product.likeCount - 1;
        const updateProductLikeCount = yield prismaclient_1.default.product.update({
            where: { id: productId },
            data: { likeCount: Number(downProductLikeCount) },
        });
        // productLikes DB에서 삭제
        yield prismaclient_1.default.productLikes.delete({
            where: { id: readProductLikeCount.id },
        });
        res.status(200).json({ updateProductLikeCount });
    });
}
