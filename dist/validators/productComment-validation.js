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
exports.commentCreateValidation = commentCreateValidation;
exports.commentUpdateValidation = commentUpdateValidation;
const superstruct_1 = require("superstruct");
const commentStructs_1 = require("../structs/commentStructs");
function commentCreateValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, superstruct_1.assert)(req.body, commentStructs_1.CreateComment);
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
