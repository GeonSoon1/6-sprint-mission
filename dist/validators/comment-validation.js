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
exports.commentCreateValidation = commentCreateValidation;
exports.commentUpdateValidation = commentUpdateValidation;
const superstruct_1 = require("superstruct");
const commentStructs_1 = require("../structs/commentStructs");
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function commentCreateValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, superstruct_1.assert)(req.body, commentStructs_1.CreateComment);
            if (!req.user)
                return res.status(401).json({ message: 'Unauthorized' });
            const userId = req.user.id;
            const productId = Number(req.params.productId);
            // product가 DB에 있는지 확인
            const product = yield prismaclient_1.default.product.findUnique({ where: { id: productId } });
            if (!product)
                return res.status(401).json({ message: 'Cannot found product' });
            // user가 DB에 존재 하는지 확인
            const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
            if (!findUser)
                return res.status(401).json({ message: 'Unauthorized' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function commentUpdateValidation(req, res, next) {
    try {
        (0, superstruct_1.assert)(req.body, commentStructs_1.PatchComment);
        next();
    }
    catch (err) {
        next(err);
    }
}
