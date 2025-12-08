"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentCreateValidation = commentCreateValidation;
exports.commentUpdateValidation = commentUpdateValidation;
const superstruct_1 = require("superstruct");
const commentStructs_1 = require("../structs/commentStructs");
function commentCreateValidation(req, res, next) {
    try {
        (0, superstruct_1.assert)(req.body, commentStructs_1.CreateComment);
        next();
    }
    catch (err) {
        next(err);
    }
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
