import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const loginDto = { username: 'testuser', password: 'testpassword' };
      const result = { accessToken: 'mockAccessToken', refreshToken: 'mockRefreshToken' };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginDto)).toEqual(result);
    });
  });

  describe('refreshToken', () => {
    it('should return a new access token', async () => {
      const refreshToken = 'mockRefreshToken';
      const result = { accessToken: 'newAccessToken' };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(result);

      expect(await authController.refresh(refreshToken)).toEqual(result);
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      const userId = 1;
      await authController.logout(userId);
      expect(authService.logout).toHaveBeenCalledWith(userId);
    });
  });
});
