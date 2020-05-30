import { IDataEntity, DataEntity } from 'src/common/models/data-entity';
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/users/models/user.entity';
import { Product } from 'src/products/models/product.entity';

export enum OrderStatus {
  Unknonw = 'unknown',
  Pending = 'pending',
  Processing = 'processing',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export interface IOrder extends IDataEntity {
  status?: OrderStatus;
  author?: User;
  products?: Product[];
}

@Entity({ name: 'orders' })
export class Order extends DataEntity implements IOrder {
  constructor(data: IOrder) {
    super();
    if (data) {
      this.id = data.id;
      this.status = data.status;
      this.author = data.author;
      this.products = data.products;
    }
  }

  @Column()
  status: OrderStatus;

  @ManyToOne(
    () => User,
    author => author.orders,
  )
  author: User;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable()
  products: Product[];
}
