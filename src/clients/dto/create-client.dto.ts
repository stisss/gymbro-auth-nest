import { Scope } from '@prisma/client';
import {
  arrayNotEmpty,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsString,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @ArrayNotEmpty()
  @IsArray()
  redirectUris: string[];

  @IsEnum(Scope, { each: true })
  @ArrayNotEmpty()
  @IsArray()
  scopes: Scope[];
}
