"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productCreateValidation = productCreateValidation;
exports.productUpdateValidation = productUpdateValidation;
const superstruct_1 = require("superstruct");
const productStructs_1 = require("../structs/productStructs");
function productCreateValidation(req, res, next) {
    try {
        (0, superstruct_1.assert)(req.body, productStructs_1.CreateProduct);
        next();
    }
    catch (err) {
        next(err);
    }
}
function productUpdateValidation(req, res, next) {
    try {
        (0, superstruct_1.assert)(req.body, productStructs_1.PatchProduct);
        next();
    }
    catch (err) {
        next(err);
    }
}
