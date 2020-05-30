import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Product } from './models/product.entity';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseError } from 'src/common/models/response';
import { QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { GetProductDto } from './models/dto/get-product.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TokenUserPayloadDto } from 'src/auth/models/dto/token-user-payload.dto';
import { VatService } from './vat.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @Inject(REQUEST) private request: Request,
    private vatService: VatService,
  ) {}

  async create(payload: Product): Promise<Product> {
    try {
      return await this.productRepository.save(payload);
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: error.toString() }),
      );
    }
  }

  async findAll(queryRequest: QueryRequest): Promise<PagedData<GetProductDto>> {
    const [items, total] = await this.productRepository.findAndCount({
      order: queryRequest.sorting.order,
      where: queryRequest.filter,
      skip: queryRequest.paging.skip,
      take: queryRequest.paging.take,
    });

    return new PagedData<GetProductDto>(
      items.map(x => new GetProductDto(x)),
      total,
    );
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return await this.productRepository.findByIds(ids);
  }

  async findOne(params: DeepPartial<Product>): Promise<Product> {
    let product: Product;
    try {
      product = await this.productRepository.findOne(params);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
    if (!product)
      throw new NotFoundException(new ResponseError({ message: 'Not Found' }));
    return product;
  }

  async findOneWithVAT(id: number): Promise<GetProductDto> {
    try {
      const user = new TokenUserPayloadDto(this.request.user);
      const vatResult = await this.vatService.getVAT(user.countryCode);
      const product = new GetProductDto(await this.findOne({ id }));
      product.price = this.vatService.calculateVAT(
        product.price,
        vatResult.rate,
      );
      return product;
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  async update(id: number, model: Product): Promise<Product> {
    const product = await this.findOne({ id });
    product.category = model.category;
    product.name = model.name;
    product.price = model.price;
    try {
      return await this.productRepository.save(product);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async delete(params: DeepPartial<Product>): Promise<Product> {
    const product = await this.findOne(params);
    try {
      return await this.productRepository.remove(product);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }
}
