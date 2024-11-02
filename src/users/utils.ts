import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashString } from '../utils';

export function createUserDtoToUserCreateInput(
  dto: CreateUserDto,
): Prisma.UserCreateInput {
  const hashedPassword = hashString(dto.password);
  return { ...dto, password: hashedPassword };
}

export function updateUserDtoToUserUpdateInput(
  dto: UpdateUserDto,
): Prisma.UserUpdateInput {
  const { password, ...rest } = dto;

  if (!password) return dto;

  return {
    ...rest,
    password: hashString(dto.password),
  };
}
