"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleCreateValidation = articleCreateValidation;
exports.articleUpdateValidation = articleUpdateValidation;
const superstruct_1 = require("superstruct");
const articleStructs_1 = require("../structs/articleStructs");
function articleCreateValidation(req, res, next) {
    try {
        (0, superstruct_1.assert)(req.body, articleStructs_1.CreateArticle);
        next();
    }
    catch (err) {
        next(err);
    }
}
function articleUpdateValidation(req, res, next) {
    try {
        (0, superstruct_1.assert)(req.body, articleStructs_1.PatchArticle);
        next();
    }
    catch (err) {
        next(err);
    }
}
