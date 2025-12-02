import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let users: jest.Mocked<UsersService>;
  let jwt: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const usersMock: jest.Mocked<UsersService> = {
      findByUsername: jest.fn(),
    } as any;

    const jwtMock: jest.Mocked<JwtService> = {
      signAsync: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get(AuthService);
    users = module.get(UsersService);
    jwt = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('validateUser throws if user is not found', async () => {
    users.findByUsername.mockResolvedValue(null as any);

    await expect(service.validateUser('admin', 'pass'))
      .rejects
      .toBeInstanceOf(UnauthorizedException);

    expect(users.findByUsername).toHaveBeenCalledWith('admin');
  });

  it('validateUser throws if password is invalid', async () => {
    const user = {
      id: 1,
      username: 'admin',
      passwordHash: 'hash',
    } as User;

    users.findByUsername.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.validateUser('admin', 'wrong'))
      .rejects
      .toBeInstanceOf(UnauthorizedException);

    expect(bcrypt.compare).toHaveBeenCalledWith('wrong', 'hash');
  });

  it('validateUser returns user if password is valid', async () => {
    const user = {
      id: 1,
      username: 'admin',
      passwordHash: 'hash',
    } as User;

    users.findByUsername.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.validateUser('admin', 'admin');

    expect(bcrypt.compare).toHaveBeenCalledWith('admin', 'hash');
    expect(result).toBe(user);
  });


  it('login throws if credentials are invalid', async () => {
    users.findByUsername.mockResolvedValue(null as any);

    await expect(service.login('sUsername', 'sPassword'))
      .rejects
      .toBeInstanceOf(UnauthorizedException);
  });

  it('login returns accessToken for valid user', async () => {
    const user = {
      id: 1,
      username: 'admin',
      role: { name: 'ADMIN' } as any,
      passwordHash: 'hash',
    } as User;

    jest.spyOn(service, 'validateUser').mockResolvedValue(user);
    jwt.signAsync.mockResolvedValue('jwt-token');

    const result = await service.login('admin', 'admin');

    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: 1,
      username: 'admin',
      role: 'ADMIN',
    });
    expect(result).toEqual({ accessToken: 'jwt-token' });
  });
});
