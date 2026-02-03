"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const prismaClient_1 = __importDefault(require("../../libs/prismaClient"));
class CommentRepository {
    async create(dto) {
        return prismaClient_1.default.comment.create({ data: dto });
    }
    async findManyComment(dto) {
        return prismaClient_1.default.comment.findMany({
            where: {
                ...Object.fromEntries(Object.entries(dto).filter(([_, v]) => v !== undefined && _ !== 'cursor' && _ !== 'take')),
            },
            take: dto.take || 10,
            skip: dto.cursor ? 1 : 0,
            ...(dto.cursor ? { cursor: { id: dto.cursor } } : {}),
            orderBy: { createdAt: 'desc' },
            select: { id: true, content: true, createdAt: true },
        });
    }
    async update(id, data) {
        return prismaClient_1.default.comment.update({ where: { id }, data });
    }
    async delete(id) {
        return prismaClient_1.default.comment.delete({ where: { id } });
    }
}
exports.CommentRepository = CommentRepository;
//# sourceMappingURL=comment.repository.js.map