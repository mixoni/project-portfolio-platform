import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let auth: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const authMock: jest.Mocked<AuthService> = {
      login: jest.fn(),
      validateUser: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authMock },
      ],
    }).compile();

    controller = module.get(AuthController);
    auth = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /auth/login delegates to AuthService.login', async () => {
    const dto = { username: 'admin', password: 'admin' };
    const result = { accessToken: 'token' };

    auth.login.mockResolvedValue(result as any);

    const response = await controller.login(dto as any);

    expect(auth.login).toHaveBeenCalledWith(dto.username, dto.password);
    expect(response).toBe(result);
  });

  it('POST /auth/login propagates UnauthorizedException from AuthService', async () => {
    const dto = { username: 'wrong', password: 'invalid' };
    const error = new UnauthorizedException('Invalid credentials');

    auth.login.mockRejectedValue(error);

    await expect(controller.login(dto as any))
      .rejects
      .toBeInstanceOf(UnauthorizedException);

    expect(auth.login).toHaveBeenCalledWith(dto.username, dto.password);
  });
});
