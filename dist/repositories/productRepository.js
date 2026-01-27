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
function findByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return constants_1.prismaClient.product.findMany({
            where: {
                id: userId,
            },
        });
    });
}
function findById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const include = {
            productLikes: userId ? { where: { userId } } : false,
        };
        return constants_1.prismaClient.product.findUniqueOrThrow({
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
            productLikes: userId ? { where: { userId } } : false,
        };
        return constants_1.prismaClient.product.findMany(Object.assign(Object.assign({}, findOptions), { include }));
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { comments, productLikes } = data, updateData = __rest(data, ["comments", "productLikes"]);
        return constants_1.prismaClient.product.update({
            where: {
                id,
            },
            data: updateData,
        });
    });
}
function create(userFields) {
    return __awaiter(this, void 0, void 0, function* () {
        const { comments, productLikes } = userFields, NewuserFields = __rest(userFields, ["comments", "productLikes"]);
        return yield constants_1.prismaClient.product.create({
            data: Object.assign({}, NewuserFields),
        });
    });
}
function ondelete(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield constants_1.prismaClient.product.delete({
            where: {
                id,
            },
        });
    });
}
exports.default = {
    findById,
    findAll,
    update,
    create,
    ondelete,
    findByUserId
};
//# sourceMappingURL=productRepository.js.map