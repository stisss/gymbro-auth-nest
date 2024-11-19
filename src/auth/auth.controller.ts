import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInDto);

    res.cookie(ACCESS_TOKEN_KEY, accessToken);
    res.cookie(REFRESH_TOKEN_KEY, refreshToken);

    res.status(HttpStatus.OK);
  }

  @Post('sign-up')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signUp(signUpDto);

    res.cookie(ACCESS_TOKEN_KEY, accessToken);
    res.cookie(REFRESH_TOKEN_KEY, refreshToken);

    res.status(HttpStatus.OK);
  }
}
