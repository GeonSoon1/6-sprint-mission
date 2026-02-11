import { Prisma, User } from '@prisma/client';
export declare class UserRepository {
    create(data: Prisma.UserCreateInput): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updateRefreshToken(id: string, refreshToken: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        nickname: string;
        password: string;
        image: string | null;
        refreshToken: string | null;
    }>;
    updateRefreshTokenByEmail(email: string, refreshToken: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        nickname: string;
        password: string;
        image: string | null;
        refreshToken: string | null;
    }>;
    clearRefreshToken(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        nickname: string;
        password: string;
        image: string | null;
        refreshToken: string | null;
    }>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
}
//# sourceMappingURL=user.repository.d.ts.map