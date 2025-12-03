import { User } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO } from '../types/dto.js';
export declare class UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(data: CreateUserDTO & {
        password: string;
    }): Promise<User>;
    update(id: number, data: UpdateUserDTO): Promise<User>;
    updatePassword(id: number, password: string): Promise<User>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=userRepository.d.ts.map