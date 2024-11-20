import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyJwt } from '../utils';
import { CustomRequest } from './CustomRequest';

@Injectable()
export class JwtBasicGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const req: CustomRequest = context.switchToHttp().getRequest();
      const [_, token] = req.headers.authorization.split(' ');

      const payload = verifyJwt(token, this.configService.get('JWT_SECRET'));
      req.userId = payload.user.id;
      return !!payload;
    } catch (e) {
      console.error(e?.message, e?.status);
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      return false;
    }
  }
}
