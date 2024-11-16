import { UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignUpDto } from './dto/sign-up.dto';

export type JwtPayload = {
  user: JwtPayloadUser;
};

export type JwtPayloadUser = {
  id: string;
  login: string;
};

export function signJwt(payloadUser: JwtPayloadUser, secret: string): string {
  const token = sign({ user: payloadUser }, secret, {
    algorithm: 'HS256',
    expiresIn: '1h',
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
