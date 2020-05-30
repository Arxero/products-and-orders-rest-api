import { Module, HttpModule } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { VatService } from './vat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService, VatService],
  exports: [ProductsService],
})
export class ProductsModule {}
