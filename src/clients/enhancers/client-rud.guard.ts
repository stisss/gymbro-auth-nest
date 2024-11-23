import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ClientsService } from '../clients.service';
import { JwtAdminGuard } from '../../auth/guards/jwt-admin.guard';
import { verifyJwt } from '../../auth/utils';
import { UsersService } from '../../users/users.service';

// TODO: tests
@Injectable()
export class ClientRudGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly clientsService: ClientsService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request>();
      const [_, token] = req.headers.authorization.split(' ');

      const payload = verifyJwt(token, this.configService.get('JWT_SECRET'));

      const client = await this.clientsService.findOne(req.params.id);
      if (client.createdById === payload.user.id) {
        return true;
      }

      const adminGuard = new JwtAdminGuard(
        this.usersService,
        this.configService,
      );
      return adminGuard.canActivate(context);
    } catch (e) {
      console.error(e?.message, e?.status);
      if (e instanceof UnauthorizedException) {
        throw e;
      }

      return false;
    }
  }
}
