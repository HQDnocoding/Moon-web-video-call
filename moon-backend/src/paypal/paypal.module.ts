import { Module } from '@nestjs/common';
import { PayPalService } from './paypal.service';
import { PayPalController } from './paypal.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule,UsersModule],
  providers: [PayPalService],
  controllers: [PayPalController]
})
export class PaypalModule {}
