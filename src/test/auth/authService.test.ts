import authService from '../../service/authService';
import authRepository from '../../repository/authRepository';
import bcrypt from 'bcrypt';
import { generateTokens } from '../../lib/token';
import ConflictError from '../../lib/errors/ConflictError';
import UnauthorizedError from '../../lib/errors/UnauthorizedError';
import NotFoundError from '../../lib/errors/NotFoundError';
import ValidationError from '../../lib/errors/ValidationError';

jest.mock('../../repository/authRepository', () => ({
  findByEmail: jest.fn(),
  findByNickname: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('../../lib/token', () => ({
  generateTokens: jest.fn(),
}));

describe('AuthService.register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('회원가입에 성공한다', async () => {
    (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (authRepository.findByNickname as jest.Mock).mockResolvedValue(null);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (authRepository.createUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      nickname: 'test',
    });

    const result = await authService.register('test@test.com', 'test', 'password123');

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(authRepository.createUser).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
  });

  test('이미 존재하는 이메일이면 ConflictError', async () => {
    (authRepository.findByEmail as jest.Mock).mockResolvedValue({ id: 1 });

    await expect(authService.register('test@test.com', 'test', '1234')).rejects.toThrow(
      ConflictError,
    );
  });

  test('이미 존재하는 닉네임이면 ConflictError', async () => {
    (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (authRepository.findByNickname as jest.Mock).mockResolvedValue({ id: 1 });

    await expect(authService.register('test@test.com', 'test', '1234')).rejects.toThrow(
      ConflictError,
    );
  });
});

describe('AuthService.login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('로그인에 성공하고 토큰을 반환한다', async () => {
    (authRepository.findByNickname as jest.Mock).mockResolvedValue({
      id: 1,
      password: 'hashed-password',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateTokens as jest.Mock).mockReturnValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const result = await authService.login('test', '1234');

    expect(bcrypt.compare).toHaveBeenCalled();
    expect(generateTokens).toHaveBeenCalled();
    expect(result).toHaveProperty('accessToken', 'access-token');
  });
  test('존재하지 않는 유저면 NotFoundError', async () => {
    (authRepository.findByNickname as jest.Mock).mockResolvedValue(null);

    await expect(authService.login('test', '1234')).rejects.toThrow(NotFoundError);
  });

  test('비밀번호가 틀리면 Validation', async () => {
    (authRepository.findByNickname as jest.Mock).mockResolvedValue({
      id: 1,
      password: 'hashed-password',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.login('test', 'wrong')).rejects.toThrow(ValidationError);
  });
});
