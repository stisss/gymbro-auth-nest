import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Consent, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PRISMA_ERRORS } from '../prisma/constants';
import { UpdateConsentDto } from './dto/update-consent.dto';

@Injectable()
export class ConsentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: any): Promise<Consent | null> {
    try {
      const result = await this.prismaService.consent.create({
        data,
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

  findAll(filter: { clientId?: string; userId?: string }): Promise<Consent[]> {
    const { clientId, userId } = filter;
    return this.prismaService.consent.findMany({
      where: {
        clientId,
        userId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prismaService.consent.findUnique({ where: { id } });
  }

  async update(params: { id: string; dto: UpdateConsentDto }) {
    const { id, dto } = params;

    try {
      const consent = await this.prismaService.consent.update({
        where: { id },
        data: dto,
      });

      return consent;
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
      await this.prismaService.consent.delete({
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
