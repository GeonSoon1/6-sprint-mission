import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository.js';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
export class AuthService {
    async register(data) {
        const { email, nickname, password } = data;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new BadRequestError('User already exists');
        }
        const user = await userRepository.create({
            email,
            nickname,
            password: hashedPassword,
        });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async login(data) {
        const { email, password } = data;
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new BadRequestError('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestError('Invalid credentials');
        }
        return generateTokens(user.id);
    }
    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new BadRequestError('Invalid refresh token');
        }
        const { id } = verifyRefreshToken(refreshToken);
        const user = await userRepository.findById(id);
        if (!user) {
            throw new BadRequestError('Invalid refresh token');
        }
        return generateTokens(id);
    }
}
export const authService = new AuthService();
//# sourceMappingURL=authService.js.map