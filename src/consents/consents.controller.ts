import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Scope } from '@prisma/client';
import { ConsentsService } from './consents.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { CustomRequest } from '../auth/guards/CustomRequest';
import { JwtBasicGuard } from '../auth/guards/jwt-basic.guard';
import { ParseScopes } from './enhancers/parse-scopes.pipe';

@Controller('consents')
export class ConsentsController {
  constructor(private readonly consentsService: ConsentsService) {}

  @UseGuards(JwtBasicGuard)
  @Post()
  create(
    @Req() req: CustomRequest,
    @Body() createConsentDto: CreateConsentDto,
  ) {
    const userId = req.userId;
    return this.consentsService.create({ userId, ...createConsentDto });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consentsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateConsentDto: UpdateConsentDto,
  ) {
    return this.consentsService.update({
      id,
      dto: updateConsentDto,
    });
  }

  @UseGuards(JwtBasicGuard)
  @Get('consent-status')
  async consentStatus(
    @Req() req: CustomRequest,
    @Query('clientId') clientId: string,
    @Query('scopes', ParseScopes) scopes: Scope[],
  ): Promise<{ consentId?: string; isGranted: boolean }> {
    const userId = req.userId;

    const consents = await this.consentsService.findAll({ clientId, userId });

    if (!consents) {
      return { consentId: null, isGranted: false };
    }

    if (consents.length > 1) {
      throw new InternalServerErrorException();
    }

    const isGranted = scopes.every((s) => consents[0].scopes.includes(s));

    return { consentId: consents[0].id, isGranted };
  }
}
