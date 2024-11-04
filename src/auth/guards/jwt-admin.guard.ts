import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { verifyJwt } from '../utils';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtAdminGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request>();
      const [_, token] = req.headers.authorization.split(' ');

      const payload = verifyJwt(token, this.configService.get('JWT_SECRET'));

      // TODO: use cache with short exp time
      const user = await this.usersService.findOne(payload.user.id);

      return user.isAdmin;
    } catch (e) {
      console.error(e?.message, e?.status);

      return false;
    }
  }
}
