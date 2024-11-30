import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { $Enums, Scope } from '@prisma/client';

export class ParseScopes implements PipeTransform<string, Scope[]> {
  transform(value: string, metadata: ArgumentMetadata): $Enums.Scope[] {
    const scopeValues = Object.values(Scope);
    const values = value.split(',');

    if (!values.length) {
      throw new BadRequestException();
    }

    return values.map((v) => {
      if (!scopeValues.includes(v as Scope)) {
        throw new BadRequestException();
      }
      return v as Scope;
    });
  }
}
