import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import {
  createUserDtoToUserCreateInput,
  updateUserDtoToUserUpdateInput,
} from './utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { OrderByItem } from '../pipes/parse-order-by.pipe';
import { UserSortableFields } from './enhancers/parse-order-by-user-fields.pipe';
import { PRISMA_ERRORS } from '../prisma/constants';

type QueryParams = {
  skip?: number;
  take?: number;
  orderBy?: OrderByItem<UserSortableFields>[];
};

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User | null> {
    const data = createUserDtoToUserCreateInput(dto);

    try {
      const result = await this.prismaService.user.create({ data });
      return result;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_ERRORS.UniqueConstraintValidation) {
          // TODO: domain error
          throw new UnprocessableEntityException(
            'Unique constraint validation',
          );
        }
      }

      throw new InternalServerErrorException();
    }
  }

  findAll(queryParams: QueryParams): Promise<User[]> {
    const orderBy = queryParams.orderBy?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.field]: curr.direction,
      }),
      {},
    ) as Prisma.UserOrderByWithRelationInput;

    return this.prismaService.user.findMany({ ...queryParams, orderBy });
  }

  findOne(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  findByLogin(login: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { login } });
  }

  async update(params: { id: string; dto: UpdateUserDto }) {
    const { id, dto } = params;
    const data = updateUserDtoToUserUpdateInput(dto);

    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data,
      });

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_ERRORS.UniqueConstraintValidation) {
          throw new UnprocessableEntityException(
            'Unique constraint validation',
          );
        }

        if (e.code === PRISMA_ERRORS.NotFound) {
          throw new NotFoundException();
        }
      }

      throw new NotFoundException();
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.user.delete({
        where: { id },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PRISMA_ERRORS.NotFound) {
          throw new NotFoundException();
        }
      }

      throw new InternalServerErrorException();
    }
  }
}
