import { Controller, Post, Body, Get, Query, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductCmd } from './models/cmd/create-product.cmd';
import { IResponseBase, ResponseSuccess } from 'src/common/models/response';
import { GetProductDto } from './models/dto/get-product.dto';
import { Product } from './models/product.entity';
import { QueryParams, QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateProductCmd } from './models/cmd/update-product.cmd';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('admin')
  async create(@Body() createModel: CreateProductCmd): Promise<IResponseBase> {
    const result = await this.productsService.create(new Product(createModel));
    return new ResponseSuccess<GetProductDto>({ result: new GetProductDto(result) });
  }

  @Get()
  async findAll(@Query() queryParams: QueryParams): Promise<IResponseBase> {
    const queryRequest = new QueryRequest(queryParams);
    const result = await this.productsService.findAll(queryRequest);
    return new ResponseSuccess<PagedData<GetProductDto>>({ result });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IResponseBase> {
    const result = await this.productsService.findOneWithVAT(id);
    return new ResponseSuccess<GetProductDto>({ result });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() updateModel: UpdateProductCmd,
  ): Promise<IResponseBase> {
    const result = await this.productsService.update(
      id,
      new Product(updateModel),
    );
    return new ResponseSuccess<GetProductDto>({ result: new GetProductDto(result) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<IResponseBase> {
    const result = await this.productsService.delete({ id });
    return new ResponseSuccess<GetProductDto>({ result: new GetProductDto(result) });
  }
}
