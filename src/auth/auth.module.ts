import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  imports: [UsersModule, ConfigModule],
  providers: [AuthService],
})
export class AuthModule {}
