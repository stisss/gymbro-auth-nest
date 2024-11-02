import { IsString, IsNumber, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class EnvironmentVariables {
  @IsString()
  @MinLength(32)
  JWT_SECRET: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  JWT_EXPIRES_IN_SECONDS: number;
}
