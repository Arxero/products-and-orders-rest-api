import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { Product } from './products/models/product.entity';
import { Order } from './orders/models/order.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/models/user.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        entities: [Order, Product, User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
    UsersModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
