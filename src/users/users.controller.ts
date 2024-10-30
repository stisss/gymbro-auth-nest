import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { OrderByItem, ParseIntOptional } from '../pipes';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ParseOrderByUserFields,
  UserSortableFields,
} from './parse-order-by-user-fields.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('skip', ParseIntOptional) skip?: number,
    @Query('take', ParseIntOptional) take?: number,
    @Query('orderBy', ParseOrderByUserFields)
    orderBy?: OrderByItem<UserSortableFields>[],
  ) {
    return this.usersService.findAll({ orderBy, skip, take });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({ id, dto: updateUserDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
