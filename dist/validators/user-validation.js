"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCreateValidation = userCreateValidation;
const superstruct_1 = require("superstruct");
const userStructs_1 = require("../structs/userStructs");
function userCreateValidation(req, res, next) {
    try {
        (0, superstruct_1.assert)(req.body, userStructs_1.CreateUser);
        next();
    }
    catch (err) {
        next(err);
    }
}
