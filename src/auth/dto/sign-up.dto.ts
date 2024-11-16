import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  login: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;
}
