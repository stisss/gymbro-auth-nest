import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export function createUserDtoToUserCreateInput(
  dto: CreateUserDto,
): Prisma.UserCreateInput {
  return dto;
}

export function updateUserDtoToUserUpdateInput(
  dto: UpdateUserDto,
): Prisma.UserUpdateInput {
  return dto;
}
