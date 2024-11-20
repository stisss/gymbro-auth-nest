import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { signAccessToken } from '../../auth/utils';
import { UsersService } from '../users.service';
import { UserRudGuard } from './user-rud.guard';

const TESTING_SECRET = 'testing-jwt';
const NOT_TESTING_SECRET = 'invalid-secret';
const VALID_ID = 'valid_id';
const INVALID_ID = 'invalid_id';
const ADMIN_PAYLOAD = { id: VALID_ID, login: 'login', isAdmin: true };
const VALID_USER_PAYLOAD = { id: VALID_ID, login: 'login', isAdmin: false };
const USER_PAYLOAD = { id: 'id', login: 'login', isAdmin: false };

const ADMIN_TOKEN = signAccessToken(ADMIN_PAYLOAD, TESTING_SECRET);
const VALID_USER_TOKEN = signAccessToken(VALID_USER_PAYLOAD, TESTING_SECRET);
const USER_TOKEN = signAccessToken(USER_PAYLOAD, TESTING_SECRET);
const INVALID_TOKEN = signAccessToken(ADMIN_PAYLOAD, NOT_TESTING_SECRET);

describe('UserRudGuard', () => {
  let guard: UserRudGuard;

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
        UserRudGuard,
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

    guard = module.get<UserRudGuard>(UserRudGuard);
  });

  const getMockedContext = (
    headers: Record<string, string>,
    params?: { id: string },
  ) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          params,
          headers,
        }),
      }),
    } as ExecutionContext;
  };

  it('should return true if user has admin role', async () => {
    const ctx = getMockedContext(
      { authorization: `Bearer ${ADMIN_TOKEN}` },
      { id: VALID_ID },
    );
    expect(await guard.canActivate(ctx)).toBe(true);
  });

  it('should return true if param id is the same as id in jwt payload', async () => {
    const ctx = getMockedContext(
      { authorization: `Bearer ${VALID_USER_TOKEN}` },
      { id: VALID_ID },
    );
    expect(await guard.canActivate(ctx)).toBe(true);
  });

  it('should return false if user does not have admin role and user id does not match param id', async () => {
    const ctx = getMockedContext(
      { authorization: `Bearer ${USER_TOKEN}` },
      { id: INVALID_ID },
    );
    expect(await guard.canActivate(ctx)).toBe(false);
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const ctx = getMockedContext({ authorization: `Bearer ${INVALID_TOKEN}` });
    try {
      await guard.canActivate(ctx);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });
});
