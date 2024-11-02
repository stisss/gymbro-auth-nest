import { UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

export type JwtPayload = {
  user: JwtPayloadUser;
};

export type JwtPayloadUser = {
  id: string;
  login: string;
};

export function signJwt(payloadUser: JwtPayloadUser, secret: string): string {
  const token = sign(payloadUser, secret, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
  return token;
}

export function verifyJwt(token: string, secret: string) {
  try {
    const payload = verify(token, secret) as JwtPayload;
    return payload;
  } catch (e) {
    throw new UnauthorizedException();
  }
}
