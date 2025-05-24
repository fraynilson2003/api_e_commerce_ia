import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { StripeModule } from '../stripe/stripe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderDetailEntity } from './entities/orderDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderDetailEntity]),
    StripeModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
