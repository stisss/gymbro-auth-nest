import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [PrismaModule, UsersModule],
})
export class ClientsModule {}
