import { IOrder, OrderStatus } from '../order.entity';
import * as moment from 'moment';

export class GetOrderDto {
  constructor(data: IOrder) {
    this.id = data.id;
    this.date = moment(data.createdAt).format('YYYY-MM-DD');
    this.products = data.products?.map(x => x.id);
    this.status = this.capitalize(data.status);
  }

  id: number;
  date: string;
  products: number[];
  status: string;

  private capitalize(x: string): string {
    const temp = x.split('');
    const firstCap = temp[0].toUpperCase();
    return x.replace(temp[0], firstCap);
  }
}
