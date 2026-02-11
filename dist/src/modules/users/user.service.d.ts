import { User } from '@prisma/client';
import { UserRepository } from '../users/user.repository';
import { UserCreateDto } from '../users/user.dto';
type CreateUserData = Omit<User, 'password' | 'refreshToken'>;
type PublicUser = Omit<User, 'password' | 'refreshToken'>;
export declare class UserService {
    private repo;
    constructor(repo: UserRepository);
    createUser(dto: UserCreateDto): Promise<CreateUserData>;
    hashingPassword(password: string): Promise<string>;
    filterSensitiveUserData(user: User): Promise<PublicUser>;
    verifyPassword(inputPassword: string, savedPassword: string): Promise<void>;
    isSamePassword(inputPassword: string, savedPassword: string): Promise<void>;
    getUser(email: string, password: string): Promise<PublicUser>;
    createToken(user: {
        id: string;
    }, type?: 'access' | 'refresh'): Promise<string>;
    refreshToken(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        newRefreshToken: string;
    }>;
    updateRefreshToken(email: string, refreshToken: string): Promise<void>;
    logOutUser(userId: string): Promise<void>;
    getUserProfile(id: string): Promise<PublicUser>;
    updateUserProfile(id: string, updateData: Partial<User>, passwordChange?: {
        oldPassword: string;
        newPassword: string;
    }): Promise<User>;
    updateUserRefreshToken(userId: string, refreshToken: string): Promise<void>;
}
export {};
//# sourceMappingURL=user.service.d.ts.map