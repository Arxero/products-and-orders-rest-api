import { IsBoolean, IsString, Length, IsNumber, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IProduct, ProductCategory } from '../product.entity';

export class CreateProductCmd implements IProduct {
  constructor(data: IProduct) {
    if (data) {
      this.name = data.name;
      this.category = data.category;
      this.price = data.price;
    }
  }
  
  @IsString()
  @Length(3, 100)
  name: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsNumber()
  @Min(0)
  price: number;
}
