import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Client, Prisma } from '@prisma/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PRISMA_ERRORS } from '../prisma/constants';

type QueryParams = {
  createdById?: string;
  skip?: number;
  take?: number;
};

@Injectable()
export class ClientsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: CreateClientDto,
    createdById: string,
  ): Promise<Client | null> {
    try {
      const result = await this.prismaService.client.create({
        data: { ...data, createdById },
      });
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

  findAll({ skip, take, createdById }: QueryParams): Promise<Client[]> {
    return this.prismaService.client.findMany({
      where: { createdById },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prismaService.client.findUnique({ where: { id } });
  }

  async update(params: { id: string; dto: UpdateClientDto }) {
    const { id, dto } = params;

    try {
      const client = await this.prismaService.client.update({
        where: { id },
        data: dto,
      });

      return client;
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

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.client.delete({
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
