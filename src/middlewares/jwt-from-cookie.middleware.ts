import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class JwtFromCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: Error | any) => void) {
    const token = req.cookies['accessToken'];

    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }

    next();
  }
}
