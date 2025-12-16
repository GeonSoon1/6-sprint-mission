import { UpdateUserDTO, UpdatePasswordDTO, ProductListQueryDTO, ProductResponseDTO, UserWithoutPassword } from '../types/index.js';
export declare class UserService {
    getMe(userId: number): Promise<UserWithoutPassword>;
    updateMe(userId: number, data: UpdateUserDTO): Promise<UserWithoutPassword>;
    updatePassword(userId: number, data: UpdatePasswordDTO): Promise<void>;
    getMyProductList(userId: number, query: ProductListQueryDTO): Promise<{
        list: ProductResponseDTO[];
        totalCount: number;
    }>;
    getMyFavoriteList(userId: number, query: ProductListQueryDTO): Promise<{
        list: ProductResponseDTO[];
        totalCount: number;
    }>;
}
export declare const userService: UserService;
//# sourceMappingURL=userService.d.ts.map