import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../users.service';
import { JwtAdminGuard } from '../../auth/guards/jwt-admin.guard';
import { verifyJwt } from '../../auth/utils';

@Injectable()
export class UserRudGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request>();
      const [_, token] = req.headers.authorization.split(' ');

      const payload = verifyJwt(token, this.configService.get('JWT_SECRET'));

      if (req.params.id === payload.user.id) {
        return true;
      }

      const adminGuard = new JwtAdminGuard(
        this.usersService,
        this.configService,
      );
      return adminGuard.canActivate(context);
    } catch (e) {
      console.error(e?.message, e?.status);

      return false;
    }
  }
}
