import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { ClientsModule } from '../clients/clients.module';
import { ConsentsModule } from '../consents/consents.module';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    ClientsModule,
    ConfigModule,
    ConsentsModule,
    CacheModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
