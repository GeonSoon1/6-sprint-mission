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
Object.defineProperty(exports, "__esModule", { value: true });
exports.productCreateValidation = productCreateValidation;
exports.productUpdateValidation = productUpdateValidation;
const superstruct_1 = require("superstruct");
const productStructs_1 = require("../structs/productStructs");
function productCreateValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 입력 값 검증
            (0, superstruct_1.assert)(req.body, productStructs_1.CreateProduct);
            next();
        }
        catch (err) {
            next(err);
        }
    });
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
