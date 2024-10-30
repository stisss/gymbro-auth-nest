import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: String;

  @IsOptional()
  @IsArray()
  redirectUris?: String[];

  @IsOptional()
  @IsArray()
  scopes?: String;
}
