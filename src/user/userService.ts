import { assert } from 'superstruct';
import { CustomError } from '../libs/Handler/errorHandler';
import userRepository from './userRepository';
import productRepository from '../product/productRepository';
import productLikeRepository from '../product/productLikeRepository';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { PatchUser, ChangePassword } from '../structs/userStructs';
import { UserType, UpdateUserPasswordType, UserPublicData } from "../libs/interfaces";


async function hashingPassword(password: string) {
    // 함수 추가
    return bcrypt.hash(password, 12);
}

class UserService {
    async createUser(user: UserType): Promise<UserPublicData> {
        const existedUser = await userRepository.findByEmail(user.email);
        if (existedUser) {
            throw new CustomError(422, 'User already exists', {
                email: user.email,
            });
        }
        const hashedPassword = await hashingPassword(user.password);
        const createdUser = await userRepository.save({
            ...user,
            password: hashedPassword,
        });
        return this.filterSensitivceUserData(createdUser);
    }

    filterSensitivceUserData(user: UserType): UserPublicData {
        const { password, refreshToken, ...rest } = user;
        return rest;
    }

    async getUser(email: string, password: string): Promise<UserPublicData> {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new CustomError(401, 'Unauthorized');

        await this.verifyPassword(password, user.password);
        return this.filterSensitivceUserData(user);
    }


    async getUserById(id: number): Promise<UserPublicData> {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }
        return this.filterSensitivceUserData(user);
    }

    async updateProfile(id: number, data: Partial<UserType>): Promise<UserPublicData> {
        assert(data, PatchUser);
        const user = await userRepository.update(id, data);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }
        return this.filterSensitivceUserData(user);
    }

    async updatePassword(id: number, data: UpdateUserPasswordType): Promise<UserPublicData> {
        assert(data, ChangePassword);
        const { currentPassword, newPassword, confirmNewPassword } = data;
        if (newPassword !== confirmNewPassword) {
            throw new CustomError(400, "Passwords don't match");
        }
        const user = await userRepository.findById(id);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }
        await this.verifyPassword(currentPassword, user.password);

        const hashedPassword = await hashingPassword(newPassword);
        const updatedUser = await userRepository.update(id, { password: hashedPassword });
        return this.filterSensitivceUserData(updatedUser);
    }

    async getProductsByUserId(id: number) {
        const products = await productRepository.findByUserId(id);
        return products;
    }

    async getLikedProductsByUserId(id: number) {
        const products = await productLikeRepository.findLikedProductsByUserId(id);
        return products;
    }


    async updateUser(id: number, data: Partial<UserType>) {
        return await userRepository.update(id, data);
    }
    async verifyPassword(inputPassword: string, savedPassword: string) {
        const isValid = await bcrypt.compare(inputPassword, savedPassword);
        if (!isValid) throw new CustomError(401, 'Unauthorized');
    }
    createToken(user: UserPublicData | UserType, type?: string) {
        const JWTsecretKey = process.env.JWT_SECRET;
        if (!JWTsecretKey) throw new CustomError(500, 'JWT_SECRET is not defined');
        const payload: JwtPayload = { userId: user.id };
        const options: SignOptions = {
            expiresIn: type === 'refresh' ? '1d' : '10m',
        };

        return jwt.sign(payload, JWTsecretKey, options);
    }
    async refreshToken(userId: number, refreshToken: string) {
        const user = await userRepository.findById(userId);
        if (!user || user.refreshToken !== refreshToken) {
            throw new CustomError(401, 'Unauthorized');
        }
        const accessToken = this.createToken(user); // 변경
        const newRefreshToken = this.createToken(user, 'refresh'); // 추가
        return { accessToken, newRefreshToken }; // 변경
    }
}

export const userService = new UserService();