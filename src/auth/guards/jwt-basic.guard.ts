import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { verifyJwt } from '../utils';

@Injectable()
export class JwtBasicGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request>();
      const [_, token] = req.headers.authorization.split(' ');

      return !!verifyJwt(token, this.configService.get('JWT_SECRET'));
    } catch (e) {
      console.error(e?.message, e?.status);

      return false;
    }
  }
}
