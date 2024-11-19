import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { compareStrings } from '../utils';
import {
  signAccessToken,
  signRefreshToken,
  signUpDtoTocreateUserDto,
} from './utils';
import { User } from '@prisma/client';
import { CustomRequest } from './guards/CustomRequest';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto): Promise<Tokens> {
    try {
      const createUserDto = signUpDtoTocreateUserDto(dto);
      const user = await this.usersService.create(createUserDto);

      const tokens = this.#generateTokens(user);
      return tokens;
    } catch (e) {
      // TODO: domain error
      throw new InternalServerErrorException();
    }
  }

  async signIn(data: SignInDto): Promise<Tokens> {
    const { login, password } = data;
    const user = await this.usersService.findByLogin(login);

    if (!user) {
      // TODO: domain error
      throw new Error();
    }

    const isPasswordValid = compareStrings(password, user.password);

    if (!isPasswordValid) {
      // TODO: domain error
      throw new UnauthorizedException();
    }

    const tokens = this.#generateTokens(user);
    return tokens;
  }

  async me(request: CustomRequest): Promise<User> {
    try {
      const userId = request.userId;

      return this.usersService.findOne(userId);
    } catch (e) {
      // TODO: domain error
      throw new NotFoundException();
    }
  }

  #generateTokens(user: User) {
    const payload = { id: user.id, login: user.login };

    const accessToken = signAccessToken(
      payload,
      this.configService.get('JWT_SECRET'),
    );
    const refreshToken = signRefreshToken(
      payload,
      this.configService.get('JWT_SECRET'),
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
