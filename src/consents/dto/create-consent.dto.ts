import { Scope } from '@prisma/client';

export class CreateConsentDto {
  clientId: string;
  scopes: Scope[];
}
