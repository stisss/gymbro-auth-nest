import { ConfigService } from '@nestjs/config';
import { JwtBasicGuardGuard } from './jwt-basic-guard.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { signJwt } from '../utils';

const TESTING_SECRET = 'testing-jwt';
const NOT_TESTING_SECRET = 'invalid-secret';
const USER_PAYLOAD = { id: 'id', login: 'login' };

const VALID_TOKEN = signJwt(USER_PAYLOAD, TESTING_SECRET);
const INVALID_TOKEN = signJwt(USER_PAYLOAD, NOT_TESTING_SECRET);

describe('JwtBasicGuardGuard', () => {
  let guard: JwtBasicGuardGuard;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue(TESTING_SECRET),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtBasicGuardGuard,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    guard = module.get<JwtBasicGuardGuard>(JwtBasicGuardGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  const mockExecutionContext = (headers: Record<string, string>) => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    };
    return mockContext as ExecutionContext;
  };

  it("should return false when if there's no token", () => {
    const ctx = mockExecutionContext({});
    expect(guard.canActivate(ctx)).toBe(false);
  });

  it('should return false when token is invalid', () => {
    const ctx = mockExecutionContext({
      authorization: `Bearer ${INVALID_TOKEN}`,
    });
    expect(guard.canActivate(ctx)).toBe(false);
  });

  it("should return false when if theres no bearer token in request's headers", () => {
    const ctx = mockExecutionContext({
      authorization: `Bearer ${VALID_TOKEN}`,
    });
    expect(guard.canActivate(ctx)).toBe(true);
  });
});
