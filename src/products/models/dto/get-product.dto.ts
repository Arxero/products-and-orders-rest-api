import { IProduct } from '../product.entity';

export class GetProductDto {
  constructor(data: IProduct) {
    this.id = data.id;
    this.name = data.name;
    this.category = this.capitalize(data.category);
    this.price = data.price.toString();
  }

  id?: number;
  name: string;
  category: string;
  price: string;

  private capitalize(x: string): string {
    if (!x) {
      return;
    }

    const temp = x.split('');
    const firstCap = temp[0].toUpperCase();
    return x.replace(temp[0], firstCap);
  }
}
