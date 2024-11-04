import { Injectable } from '@nestjs/common';
import { ParseOrderByPipe } from '../../pipes/parse-order-by.pipe';

export type UserSortableFields = 'email' | 'login';

@Injectable()
export class ParseOrderByUserFields extends ParseOrderByPipe<UserSortableFields> {
  getValidValues(): UserSortableFields[] {
    return ['email', 'login'];
  }
}
