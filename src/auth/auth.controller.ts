import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { JwtBasicGuard } from './guards/jwt-basic.guard';
import { CustomRequest } from './guards/CustomRequest';

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

  @UseGuards(JwtBasicGuard)
  @Get('me')
  me(@Req() req: CustomRequest) {
    return this.authService.me(req);
  }

  @UseGuards(JwtBasicGuard)
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_TOKEN_KEY);
    res.clearCookie(REFRESH_TOKEN_KEY);
    res.status(HttpStatus.OK);
  }
}
