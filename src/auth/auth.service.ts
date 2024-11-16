import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { compareStrings } from '../utils';
import { signJwt, signUpDtoTocreateUserDto } from './utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto): Promise<string> {
    try {
      const createUserDto = signUpDtoTocreateUserDto(dto);
      const user = await this.usersService.create(createUserDto);

      const token = signJwt(
        { id: user.id, login: user.login },
        this.configService.get('JWT_SECRET'),
      );

      return token;
    } catch (e) {
      // TODO: domain error
      throw new InternalServerErrorException();
    }
  }

  async signIn(data: SignInDto): Promise<string> {
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

    const token = signJwt(
      { id: user.id, login: user.login },
      this.configService.get('JWT_SECRET'),
    );

    return token;
  }
}
