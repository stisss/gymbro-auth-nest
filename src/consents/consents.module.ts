import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsentsService } from './consents.service';
import { ConsentsController } from './consents.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ConsentsController],
  providers: [ConsentsService],
  imports: [PrismaModule, ConfigModule],
  exports: [ConsentsService],
})
export class ConsentsModule {}
