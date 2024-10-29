import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

export type SortDirection = 'asc' | 'desc';

export interface OrderByItem<T> {
  field: T;
  direction: SortDirection;
}

@Injectable()
export abstract class ParseOrderByPipe<T>
  implements PipeTransform<string, OrderByItem<T>[]>
{
  transform(value: string, metadata: ArgumentMetadata): OrderByItem<T>[] {
    if (!value) return [];

    try {
      const items = value.split(',').map((item) => {
        const [field, direction] = item.split(',');

        const normalizedDirection = (direction?.toLowerCase() ||
          'asc') as SortDirection;
        if (normalizedDirection !== 'asc' && normalizedDirection !== 'desc') {
          throw new Error(`Invalid direction: ${direction}`);
        }

        if (!this.validateField(field)) {
          throw new Error(`Invalid sort field: ${field}`);
        }

        return { field: field as T, direction: normalizedDirection };
      });

      return items;
    } catch (e) {}
  }

  validateField(field: string): boolean {
    return this.getValidValues().includes(field as T);
  }
  abstract getValidValues(): T[];
}
