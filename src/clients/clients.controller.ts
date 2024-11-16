import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ParseIntOptional } from '../pipes';
import { CustomRequest } from '../auth/guards/CustomRequest';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Req() req: CustomRequest, @Body() createClientDto: CreateClientDto) {
    const userId = req.userId;
    return this.clientsService.create(createClientDto, userId);
  }

  @Get()
  findAll(
    @Req() req: CustomRequest,
    @Query('skip', ParseIntOptional) skip?: number,
    @Query('take', ParseIntOptional) take?: number,
    @Query('createdById') createdById?: string,
  ) {
    const userId = req.isAdmin ? createdById : (createdById ?? req.userId);
    return this.clientsService.findAll({ createdById: userId, skip, take });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update({ id, dto: updateClientDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}