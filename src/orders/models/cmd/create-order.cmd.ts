import { IsNumber } from 'class-validator';
import { IOrder } from '../order.entity';

export class CreateOrderCmd {
  constructor(data: { productIds?: number[] }) {
    if (data) {
      this.productIds = data.productIds;
    }
  }

  @IsNumber({}, { each: true })
  productIds: number[];
}
