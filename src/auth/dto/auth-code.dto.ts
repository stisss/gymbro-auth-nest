import { ArrayNotEmpty, IsArray, IsEnum, IsString } from 'class-validator';
import { Scope } from '@prisma/client';

export class AuthCodeDto {
  clientId: string;

  @IsEnum(Scope, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  scopes: Scope[];

  @IsString()
  redirectUri: string;
}
