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
const prismaClient_js_1 = require("../lib/prismaClient.js");
const token_js_1 = require("../lib/token.js");
const constants_js_1 = require("../lib/constants.js");
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = req.cookies[constants_js_1.ACCESS_TOKEN_COOKIE_NAME];
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const { userId } = (0, token_js_1.verifyAccessToken)(accessToken);
            const user = yield prismaClient_js_1.prismaClient.user.findUnique({ where: { id: userId } });
            req.user = user;
        }
        catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    });
}
exports.default = authenticate;
