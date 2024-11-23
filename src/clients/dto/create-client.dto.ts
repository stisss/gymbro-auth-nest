import {
  arrayNotEmpty,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsString,
} from 'class-validator';

enum Scope {
  EMAIL = 'EMAIL',
  LOGIN = 'LOGIN',
}

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
