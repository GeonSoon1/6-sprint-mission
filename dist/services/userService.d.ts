import { UserType, UpdateUserPasswordType, UserPublicData } from "./../libs/interfaces";
declare class UserService {
    createUser(user: UserType): Promise<UserPublicData>;
    filterSensitivceUserData(user: UserType): UserPublicData;
    getUser(email: string, password: string): Promise<UserPublicData>;
    getUserById(id: number): Promise<UserPublicData>;
    updateProfile(id: number, data: Partial<UserType>): Promise<UserPublicData>;
    updatePassword(id: number, data: UpdateUserPasswordType): Promise<UserPublicData>;
    getProductsByUserId(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        tags: string[];
    }[]>;
    getLikedProductsByUserId(id: number): Promise<({
        product: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            price: number;
            tags: string[];
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
    })[]>;
    updateUser(id: number, data: Partial<UserType>): Promise<{
        password: string;
        refreshToken: string | null;
        id: number;
        email: string;
        nickname: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyPassword(inputPassword: string, savedPassword: string): Promise<void>;
    createToken(user: UserPublicData | UserType, type?: string): string;
    refreshToken(userId: number, refreshToken: string): Promise<{
        accessToken: string;
        newRefreshToken: string;
    }>;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=userService.d.ts.map