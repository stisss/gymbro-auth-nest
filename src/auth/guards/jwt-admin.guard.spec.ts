import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { JwtAdminGuard } from './jwt-admin.guard';
import { UsersService } from '../../users/users.service';
import { signJwt } from '../utils';

const TESTING_SECRET = 'testing-jwt';
const NOT_TESTING_SECRET = 'invalid-secret';
const ADMIN_PAYLOAD = { id: 'admin_id', login: 'login', isAdmin: true };
const USER_PAYLOAD = { id: 'id', login: 'login', isAdmin: false };

const ADMIN_TOKEN = signJwt(ADMIN_PAYLOAD, TESTING_SECRET);
const USER_TOKEN = signJwt(USER_PAYLOAD, TESTING_SECRET);
const INVALID_TOKEN = signJwt(ADMIN_PAYLOAD, NOT_TESTING_SECRET);

describe('JwtAdminGuard', () => {
  let guard: JwtAdminGuard;

  const mockedConfigService = {
    get: jest.fn().mockReturnValue(TESTING_SECRET),
  };

  // TODO: use moq.ts or some other smart library for mocks
  const mockedUsersService = {
    findOne: jest.fn((id) =>
      id === 'admin_id' ? { isAdmin: true } : { isAdmin: false },
    ),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtAdminGuard,
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    guard = module.get<JwtAdminGuard>(JwtAdminGuard);
  });

  const getMockedContext = (headers: Record<string, string>) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    } as ExecutionContext;
  };

  it('should return true if user has admin role', async () => {
    const ctx = getMockedContext({ authorization: `Bearer ${ADMIN_TOKEN}` });
    expect(await guard.canActivate(ctx)).toBe(true);
  });

  it('should return false if user does not have admin role', async () => {
    const ctx = getMockedContext({ authorization: `Bearer ${USER_TOKEN}` });
    expect(await guard.canActivate(ctx)).toBe(false);
  });

  it('should return false if token is invalid', async () => {
    const ctx = getMockedContext({ authorization: `Bearer ${INVALID_TOKEN}` });
    expect(await guard.canActivate(ctx)).toBe(false);
  });
});
