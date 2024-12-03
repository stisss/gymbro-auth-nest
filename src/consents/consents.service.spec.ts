import { Test, TestingModule } from '@nestjs/testing';
import { ConsentsService } from './consents.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

describe('ConsentsService', () => {
  let service: ConsentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsentsService],
      imports: [PrismaModule, ConfigModule],
    }).compile();

    service = module.get<ConsentsService>(ConsentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
