import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './models/order.entity';
import { CreateOrderCmd } from './models/cmd/create-order.cmd';
import { IResponseBase, ResponseSuccess } from 'src/common/models/response';
import { QueryParams, QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { UpdateOrderCmd } from './models/cmd/update-order.cmd';
import { GetOrderDto } from './models/dto/get-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createModel: CreateOrderCmd): Promise<IResponseBase> {
    const result = await this.ordersService.create(createModel);
    return new ResponseSuccess<GetOrderDto>({
      result: new GetOrderDto(result),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('admin')
  async findAll(@Query() queryParams: QueryParams): Promise<IResponseBase> {
    const queryRequest = new QueryRequest(queryParams);
    const result = await this.ordersService.findAll(queryRequest);
    return new ResponseSuccess<PagedData<GetOrderDto>>({ result });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IResponseBase> {
    const result = new GetOrderDto(await this.ordersService.findOne({ id }));
    return new ResponseSuccess<GetOrderDto>({ result });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() updateModel: UpdateOrderCmd,
  ): Promise<IResponseBase> {
    const result = await this.ordersService.update(id, new Order(updateModel));
    return new ResponseSuccess<GetOrderDto>({
      result: new GetOrderDto(result),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<IResponseBase> {
    const result = await this.ordersService.delete({ id });
    return new ResponseSuccess<GetOrderDto>({
      result: new GetOrderDto(result),
    });
  }
}
