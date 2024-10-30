import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  const mockUserService = {
    findOne: jest.fn(),
    create: jest.fn(),
    updateRefreshToken: jest.fn(),
    findById: jest.fn(),
    removeRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const user: User = {
          id: 1, username: 'testuser', password: 'hashedpassword', role: 'user',
          refreshToken: ''
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
    //   jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser('testuser', 'plaintextpassword');
      expect(result).toEqual(user);
      expect(userService.findOne).toHaveBeenCalledWith('testuser');
    });

    it('should return null if credentials are invalid', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser('testuser', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const user = { id: 1, username: 'testuser', role: 'user' };
      jest.spyOn(userService, 'updateRefreshToken').mockResolvedValue(undefined);
      jest.spyOn(mockJwtService, 'sign').mockReturnValue('mockAccessToken');
      jest.spyOn(mockJwtService, 'sign').mockReturnValue('mockRefreshToken');

      const result = await authService.login(user);
      expect(result).toEqual({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      });
      expect(userService.updateRefreshToken).toHaveBeenCalledWith(1, expect.any(String));
    });
  });

  describe('refreshToken', () => {
    it('should return a new access token if refresh token is valid', async () => {
      const user = { id: 1, username: 'testuser', role: 'user', refreshToken: 'mockRefreshToken' };
      const payload = { username: user.username };
      jest.spyOn(mockJwtService, 'verify').mockReturnValue(payload);
    //   jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(mockJwtService, 'sign').mockReturnValue('newAccessToken');

      const result = await authService.refreshToken('mockRefreshToken');
      expect(result).toEqual({ accessToken: 'newAccessToken' });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      jest.spyOn(mockJwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken('invalidToken')).rejects.toThrow(UnauthorizedException);
    });
  });
});
