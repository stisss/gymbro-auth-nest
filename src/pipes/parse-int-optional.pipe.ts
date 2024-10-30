import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class ParseIntOptional
  implements PipeTransform<string, number | undefined>
{
  transform(value: string, metadata: ArgumentMetadata): number | undefined {
    if (!value) return undefined;

    try {
      return parseInt(value);
    } catch (e) {
      throw new Error('Validation failed (numeric string is expected)');
    }
  }
}
