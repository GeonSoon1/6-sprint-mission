import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import {
  BadRequestError,
  ForbiddenError,
  IsSamePasswordError,
  NotFoundError,
} from '../../libs/error';
import { User } from '@prisma/client';
import { UserRepository } from '../users/user.repository';
import { UserCreateDto } from '../users/user.dto';

type CreateUserData = Omit<User, 'password' | 'refreshToken'>;
type PublicUser = Omit<User, 'password' | 'refreshToken'>;

export class UserService {
  constructor(private repo: UserRepository) {}

  async createUser(dto: UserCreateDto): Promise<CreateUserData> {
    const { email, password, ...rest } = dto;

    const existedUser = await this.repo.findByEmail(email);
    if (existedUser) throw new BadRequestError('이미 존재하는 사용자');

    const hashedPassword = await this.hashingPassword(password);
    const createdUser = await this.repo.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    return this.filterSensitiveUserData(createdUser);
  }

  async hashingPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async filterSensitiveUserData(user: User): Promise<PublicUser> {
    const { password, refreshToken, ...rest } = user;
    return rest;
  }

  async verifyPassword(
    inputPassword: string,
    savedPassword: string
  ): Promise<void> {
    const isValid = await bcrypt.compare(inputPassword, savedPassword);
    if (!isValid) throw new ForbiddenError();
  }

  async isSamePassword(
    inputPassword: string,
    savedPassword: string
  ): Promise<void> {
    const isSame = await bcrypt.compare(inputPassword, savedPassword);
    if (isSame) throw new IsSamePasswordError();
  }

  async getUser(email: string, password: string): Promise<PublicUser> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new BadRequestError('사용자 없음');
    await this.verifyPassword(password, user.password);
    return this.filterSensitiveUserData(user);
  }

  async createToken(
    user: { id: string },
    type?: 'access' | 'refresh'
  ): Promise<string> {
    const payload = { userId: user.id };
    const options: SignOptions = {
      expiresIn: type === 'refresh' ? '2w' : '1h',
    };
    return jwt.sign(payload, process.env.JWT_SECRET!, options);
  }

  //JWT 슬라이딩 세션
  async refreshToken(
    userId: string,
    refreshToken: string
  ): Promise<{
    accessToken: string;
    newRefreshToken: string;
  }> {
    const user = await this.repo.findById(userId);
    if (!user || user.refreshToken !== refreshToken)
      throw new BadRequestError();
    const accessToken = await this.createToken(user);
    const newRefreshToken = await this.createToken(user, 'refresh');
    await this.repo.updateRefreshToken(userId, newRefreshToken);
    return { accessToken, newRefreshToken };
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.repo.updateRefreshTokenByEmail(email, refreshToken);
  }

  async logOutUser(userId: string): Promise<void> {
    await this.repo.clearRefreshToken(userId);
  }

  async getUserProfile(id: string): Promise<PublicUser> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundError();
    return this.filterSensitiveUserData(user);
  }

  async updateUserProfile(
    id: string,
    updateData: Partial<User>,
    passwordChange?: { oldPassword: string; newPassword: string }
  ): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundError();

    if (passwordChange) {
      await this.verifyPassword(passwordChange.oldPassword, user.password);
      await this.isSamePassword(passwordChange.newPassword, user.password);
      updateData.password = await this.hashingPassword(
        passwordChange.newPassword
      );
    }

    return this.repo.update(id, updateData);
  }

  async updateUserRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    await this.repo.updateRefreshToken(userId, refreshToken);
  }
}
