import { prismaClient } from '../lib/prismaClient.js';
export class UserRepository {
    async findByEmail(email) {
        return prismaClient.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return prismaClient.user.findUnique({ where: { id } });
    }
    async create(data) {
        return prismaClient.user.create({ data });
    }
    async update(id, data) {
        return prismaClient.user.update({ where: { id }, data });
    }
    async updatePassword(id, password) {
        return prismaClient.user.update({ where: { id }, data: { password } });
    }
}
export const userRepository = new UserRepository();
//# sourceMappingURL=userRepository.js.map