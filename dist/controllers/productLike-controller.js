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
        const userId = req.user.id;
        const product = req.product;
        const productId = product.id;
        // likeCount 증가 작업
        const upProductLikeCount = product.likeCount + 1;
        const updateProductLikesCount = yield prismaclient_1.default.product.update({
            where: { id: productId },
            data: { likeCount: Number(upProductLikeCount) },
        });
        // productLikes DB에 기록
        const updateProductLikesDB = yield prismaclient_1.default.productLikes.create({
            data: {
                userId,
                productId,
            },
        });
        res.status(200).json({ updateProductLikesCount, updateProductLikesDB });
    });
}
function likeCountDown(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user.id;
        const product = req.product;
        const productId = product.id;
        // likeCount 감소 작업
        const downProductLikeCount = product.likeCount - 1;
        const updateProductLikeCount = yield prismaclient_1.default.product.update({
            where: { id: productId },
            data: { likeCount: Number(downProductLikeCount) },
        });
        const deleteProLikeId = req.proLikeId;
        // productLikes DB에서 삭제
        yield prismaclient_1.default.productLikes.delete({
            where: { id: deleteProLikeId },
        });
        res.status(200).json({ updateProductLikeCount });
    });
}
