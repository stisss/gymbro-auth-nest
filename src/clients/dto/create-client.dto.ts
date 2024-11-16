import { IsArray, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsArray()
  redirectUris: string[];

  // add type safety
  @IsArray()
  scopes: string[];
}
