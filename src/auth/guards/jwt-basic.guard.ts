import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { verifyJwt } from '../utils';
import { CustomRequest } from './CustomRequest';

@Injectable()
export class JwtBasicGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req: CustomRequest = context.switchToHttp().getRequest();
      const [_, token] = req.headers.authorization.split(' ');

      const payload = verifyJwt(token, this.configService.get('JWT_SECRET'));
      req.userId = payload.user.id;
      return !!payload;
    } catch (e) {
      console.error(e?.message, e?.status);

      return false;
    }
  }
}
