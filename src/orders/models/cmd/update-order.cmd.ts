import { IsBoolean, IsString, Length, IsNumber, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IOrder, OrderStatus } from '../order.entity';

export class UpdateOrderCmd implements IOrder {
  constructor(data: IOrder) {
    if (data) {
      this.status = data.status;
    }
  }

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
