import { UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignUpDto } from './dto/sign-up.dto';

const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export type JwtPayload = {
  user: JwtPayloadUser;
};

export type JwtPayloadUser = {
  id: string;
  login: string;
};

export function signAccessToken(
  payloadUser: JwtPayloadUser,
  secret: string,
): string {
  const token = signJwt(payloadUser, secret, ACCESS_TOKEN_EXPIRES_IN);

  return token;
}

export function signRefreshToken(
  payloadUser: JwtPayloadUser,
  secret: string,
): string {
  const token = signJwt(payloadUser, secret, REFRESH_TOKEN_EXPIRES_IN);
  return token;
}

function signJwt(
  payloadUser: JwtPayloadUser,
  secret: string,
  expiresIn: string,
): string {
  const token = sign({ user: payloadUser }, secret, {
    algorithm: 'HS256',
    expiresIn,
  });

  return token;
}

export function verifyJwt(token: string, secret: string): JwtPayload {
  try {
    const payload = verify(token, secret) as JwtPayload;
    return payload;
  } catch (e) {
    throw new UnauthorizedException();
  }
}

export function signUpDtoTocreateUserDto(dto: SignUpDto): CreateUserDto {
  return dto as CreateUserDto;
}

export function generateAuthCode(): string {
  return randomBytes(20).toString('hex');
}
