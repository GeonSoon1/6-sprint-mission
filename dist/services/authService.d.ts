import { RegisterDTO, LoginDTO, UserWithoutPassword } from '../types/index.js';
export declare class AuthService {
    register(data: RegisterDTO): Promise<UserWithoutPassword>;
    login(data: LoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map