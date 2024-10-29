import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import {
  createUserDtoToUserCreateInput,
  updateUserDtoToUserUpdateInput,
} from './utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { OrderByItem } from '../pipes/parse-order-by.pipe';
import { UserSortableFields } from './parse-order-by-user-fields.pipe';

type QueryParams = {
  skip?: number;
  take?: number;
  where?: Prisma.UserWhereInput;
  orderBy?: OrderByItem<UserSortableFields>[];
};

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(dto: CreateUserDto): Promise<User | null> {
    const data = createUserDtoToUserCreateInput(dto);
    return this.prismaService.user.create({ data });
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

  findOne(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  update(params: { id: number; dto: UpdateUserDto }) {
    const { id, dto } = params;
    const data = updateUserDtoToUserUpdateInput(dto);
    console.log(params);
    return this.prismaService.user.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
