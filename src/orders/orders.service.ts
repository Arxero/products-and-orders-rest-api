import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Order, OrderStatus } from './models/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ResponseError } from 'src/common/models/response';
import { QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { Product } from 'src/products/models/product.entity';
import { GetOrderDto } from './models/dto/get-order.dto';
import { ProductsService } from 'src/products/products.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TokenUserPayloadDto } from 'src/auth/models/dto/token-user-payload.dto';
import { UsersService } from 'src/users/users.service';
import { CreateOrderCmd } from './models/cmd/create-order.cmd';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private productsService: ProductsService,
    private usersService: UsersService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(payload: CreateOrderCmd): Promise<Order> {
    try {
      const user = new TokenUserPayloadDto(this.request.user);
      const order = new Order({
        author: await this.usersService.findOne({ id: user.id }),
        products: await this.productsService.findByIds(payload.productIds),
        status: OrderStatus.Pending,
      });

      return await this.orderRepository.save(order);
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: error.toString() }),
      );
    }
  }

  async findAll(queryRequest: QueryRequest): Promise<PagedData<GetOrderDto>> {
    const [items, total] = await this.orderRepository.findAndCount({
      order: queryRequest.sorting.order,
      where: queryRequest.filter,
      skip: queryRequest.paging.skip,
      take: queryRequest.paging.take,
      relations: ['products'],
    });

    return new PagedData<GetOrderDto>(
      items.map(x => new GetOrderDto(x)),
      total,
    );
  }

  async findOne(params: DeepPartial<Order>): Promise<Order> {
    let order: Order;
    try {
      order = await this.orderRepository.findOne(params, {
        relations: ['products'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
    if (!order)
      throw new NotFoundException(new ResponseError({ message: 'Not Found' }));
    return order;
  }

  async update(id: number, model: Order): Promise<Order> {
    const order = await this.findOne({ id });
    order.status = model.status;
    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async delete(params: DeepPartial<Order>): Promise<Order> {
    const order = await this.findOne(params);
    try {
      return await this.orderRepository.remove(order);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }
}
