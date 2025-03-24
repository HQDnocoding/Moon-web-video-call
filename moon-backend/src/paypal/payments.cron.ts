import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PayPalService } from './paypal.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PaymentsCronService {
  constructor(
    private readonly payPalService: PayPalService,
    private readonly userService: UsersService,
  ) {}

  // Cron job chạy vào 00:00 ngày 1 của mỗi tháng
  // @Cron('0 0 1 * *')
  // @Cron('*/1 * * * *') 
  // async chargeAllUsers() {
  //   console.log('Running monthly billing job...');
  //   const users = await this.userService.getAllUsersWithPaymentInfo();

  //   for (const user of users) {
  //     if (10 > 0 && user.get("vaulToken")) {
  //       try {
  //         const result = await this.payPalService.chargeUser(user.get("vaulToken"), "10");
  //         console.log(`Charged user ${user.id} successfully:`, result);
  //       } catch (error) {
  //         console.error(`Failed to charge user ${user.id}:`, error.message);
  //       }
  //     }
  //   }
  // }
}
