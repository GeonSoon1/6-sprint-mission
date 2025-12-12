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
        const article = req.article;
        const articleId = article.id;
        // likeCount 증가 작업
        const upArticleLikeCount = article.likeCount + 1;
        const updateArticleLikesCount = yield prismaclient_1.default.article.update({
            where: { id: articleId },
            data: { likeCount: Number(upArticleLikeCount) },
        });
        // articleLikes DB에 기록
        const updateArticleLikesDB = yield prismaclient_1.default.articleLikes.create({
            data: {
                userId,
                articleId,
            },
        });
        res.status(200).json({ updateArticleLikesCount, updateArticleLikesDB });
    });
}
function likeCountDown(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user.id;
        const article = req.article;
        const articleId = article.id;
        // likeCount 감소 작업
        const downArticleLikeCount = article.likeCount - 1;
        const updateArticleLikeCount = yield prismaclient_1.default.article.update({
            where: { id: articleId },
            data: { likeCount: Number(downArticleLikeCount) },
        });
        const deleteArtLikeId = req.artLikeId;
        // articleLikes DB에서 삭제
        yield prismaclient_1.default.articleLikes.delete({
            where: { id: deleteArtLikeId },
        });
        res.status(200).json({ updateArticleLikeCount });
    });
}
