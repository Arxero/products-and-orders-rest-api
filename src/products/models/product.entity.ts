import { IDataEntity, DataEntity } from 'src/common/models/data-entity';
import { Entity, Column } from 'typeorm';

export enum ProductCategory {
  Unknown = 'unknown',
  Fruit = 'fruit',
  Diary = 'diary',
}

export interface IProduct extends IDataEntity {
  name: string;
  category: ProductCategory;
  price: number;
}

@Entity({ name: 'products' })
export class Product extends DataEntity implements IProduct {
  constructor(data: IProduct) {
    super();
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.category = data.category;
      this.price = data.price;
    }
  }

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column()
  category: ProductCategory;

  @Column({type: 'decimal', precision: 5, scale: 2, default: 0 })
  price: number;
}
