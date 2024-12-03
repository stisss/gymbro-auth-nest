import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [PrismaModule, UsersModule, ConfigModule],
  exports: [ClientsService],
})
export class ClientsModule {}
