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
exports.productCreateValidation = productCreateValidation;
exports.productListValidation = productListValidation;
exports.productInfoValidation = productInfoValidation;
exports.productUpdateValidation = productUpdateValidation;
exports.productUserCheckValidation = productUserCheckValidation;
const superstruct_1 = require("superstruct");
const productStructs_1 = require("../structs/productStructs");
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
function productCreateValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 입력 값 검증
            (0, superstruct_1.assert)(req.body, productStructs_1.CreateProduct);
            // user 정보 검증
            if (!req.user)
                return res.status(401).json({ message: '사용자 정보를 확인 해 주세요' });
            const userId = Number(req.user.id);
            if (userId <= 0)
                return res.status(401).json({ message: '유효한 사용자 ID가 아닙니다' });
            const userIdFloat = userId % 1;
            if (userIdFloat)
                return res.status(401).json({ message: '유효한 사용자 ID가 아닙니다' });
            const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
            if (!findUser)
                return res
                    .status(401)
                    .json({ message: '사용자 정보를 찾을 수 없습니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function productListValidation(req, res, next) {
    var _a, _b, _c, _d, _e;
    try {
        // offset & limit : 숫자 변환 + 검증
        const offset = Number((_a = req.query.offset) !== null && _a !== void 0 ? _a : 0);
        const limit = Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 10);
        if (isNaN(offset) || offset < 0)
            return res.status(401).json({ message: '숫자를 입력 해 주세요' });
        if (isNaN(limit) || limit <= 0 || limit > 100)
            return res
                .status(401)
                .json({ message: '1에서 100 사이 숫자를 입력 해 주세요' });
        // name & description : 문자 검증
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
                orderBy = { createdAt: 'desc' };
        }
        req.validated = {
            offset,
            limit,
            name,
            description,
            orderBy,
        };
        next();
    }
    catch (err) {
        next(err);
    }
}
function productInfoValidation(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!id || id <= 0)
            return res
                .status(401)
                .json({ message: '유효한 제품 ID를 입력 해 주세요' });
        next();
    }
    catch (err) {
        next(err);
    }
}
function productUpdateValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, superstruct_1.assert)(req.body, productStructs_1.PatchProduct);
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function productUserCheckValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // product가 DB에 있는지 확인
            const productId = Number(req.params.id);
            if (productId <= 0)
                return res.status(401).json({ message: '유효한 제품 ID가 아닙니다' });
            const product = yield prismaclient_1.default.product.findUnique({
                where: { id: productId },
            });
            if (!product)
                return res.status(401).json({ message: '제품 정보를 찾을 수 없습니다.' });
            // user 정보가 있는지 확인
            if (!req.user)
                return res.status(401).json({ message: '사용자 정보를 확인 해 주세요' });
            // user가 DB에 존재 하는지 확인
            const userId = Number(req.user.id);
            if (userId <= 0)
                return res.status(401).json({ message: '유효한 사용자 ID가 아닙니다' });
            const findUser = yield prismaclient_1.default.user.findUnique({ where: { id: userId } });
            if (!findUser)
                return res
                    .status(401)
                    .json({ message: '사용자 정보를 찾을 수 없습니다' });
            // 동일한 user 인지 확인
            if (product.userId !== userId)
                return res
                    .status(401)
                    .json({ message: '제품을 등록한 사용자가 아닙니다' });
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
