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
exports.articleUserCheck = articleUserCheck;
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function articleUserCheck(userId, articleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield prismaclient_1.default.article.findUnique({ where: { id: articleId } });
        const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
        if (!article || !findUser) {
            // article 또는 user가 DB에 있는지 확인
            return false;
        }
        else if (article.userId !== userId) {
            // DB에 있는 article userID 정보와 로그인 한 User 정보가 같은지 확인
            return false;
        }
        return true;
    });
}
