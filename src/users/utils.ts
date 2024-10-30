import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../utils';

export function createUserDtoToUserCreateInput(
  dto: CreateUserDto,
): Prisma.UserCreateInput {
  const hashedPassword = hashPassword(dto.password);
  return { ...dto, password: hashedPassword };
}

export function updateUserDtoToUserUpdateInput(
  dto: UpdateUserDto,
): Prisma.UserUpdateInput {
  const { password, ...rest } = dto;

  if (!password) return dto;

  return {
    ...rest,
    password: hashPassword(dto.password),
  };
}
