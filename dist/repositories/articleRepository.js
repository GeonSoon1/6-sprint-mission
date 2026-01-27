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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../libs/constants");
function findById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const include = {
            articleLikes: userId ? { where: { userId } } : false,
        };
        return constants_1.prismaClient.article.findUniqueOrThrow({
            where: {
                id,
            },
            include,
        });
    });
}
function findAll(findOptions, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const include = {
            articleLikes: userId ? { where: { userId } } : false,
        };
        return constants_1.prismaClient.article.findMany(Object.assign(Object.assign({}, findOptions), { include }));
    });
}
function create(userFields) {
    return __awaiter(this, void 0, void 0, function* () {
        const { comments, articleLikes } = userFields, NewuserFields = __rest(userFields, ["comments", "articleLikes"]);
        return yield constants_1.prismaClient.article.create({
            data: Object.assign({}, NewuserFields),
        });
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { comments, articleLikes } = data, updateData = __rest(data, ["comments", "articleLikes"]);
        return constants_1.prismaClient.article.update({
            where: {
                id,
            },
            data: updateData,
        });
    });
}
function ondelete(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield constants_1.prismaClient.article.delete({
            where: {
                id,
            },
        });
    });
}
exports.default = {
    findById,
    findAll,
    create,
    update,
    ondelete,
};
//# sourceMappingURL=articleRepository.js.map