import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ConsentsModule } from '../consents/consents.module';
import { ClientsModule } from '../clients/clients.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [
        UsersModule,
        ConfigModule,
        ConsentsModule,
        ClientsModule,
        CacheModule.register(),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
