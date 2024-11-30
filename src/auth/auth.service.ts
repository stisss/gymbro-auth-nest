import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Scope, User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { compareStrings } from '../utils';
import {
  generateAuthCode,
  signAccessToken,
  signRefreshToken,
  signUpDtoTocreateUserDto,
} from './utils';
import { CustomRequest } from './guards/CustomRequest';
import { AuthCodeDto } from './dto/auth-code.dto';
import { ClientsService } from '../clients/clients.service';
import { ConsentsService } from 'src/consents/consents.service';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const AUTH_CODE_TTL = 60;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly clientsService: ClientsService,
    private readonly configService: ConfigService,
    private readonly consentsService: ConsentsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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

  async #checkIfConsentsGranted(
    userId: string,
    clientId: string,
    scopes: Scope[],
  ): Promise<void> {
    const consents = await this.consentsService.findAll({ clientId, userId });

    if (!consents || !consents.length) {
      throw new ForbiddenException('Consents have not been granted');
    }

    if (consents.length > 1) {
      throw new InternalServerErrorException();
    }

    if (scopes.every((s) => consents[0].scopes.includes(s))) {
      throw new ForbiddenException('Granted consents are not sufficient');
    }
  }

  async generateAuthCode(userId: string, dto: AuthCodeDto): Promise<string> {
    const { clientId, redirectUri, scopes } = dto;

    const client = await this.clientsService.findOne(clientId);

    if (!client.redirectUris.includes(redirectUri)) {
      // mismatch
      throw new Error();
    }

    await this.#checkIfConsentsGranted(userId, clientId, scopes);

    const authCode = generateAuthCode();

    await this.cacheManager.set(
      authCode,
      { authCode, clientId },
      AUTH_CODE_TTL,
    );

    return authCode;
  }
}
