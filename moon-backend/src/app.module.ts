import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PayPalService } from './paypal/paypal.service';
import { PaypalModule } from './paypal/paypal.module';
import * as dotenv from'dotenv'
import {  PaymentsCronService } from './paypal/payments.cron';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

dotenv.config()
const usernameMDB:string=process.env.USERNAME_MDB || "admin";
const passwordMDB:string=process.env.PASSWORD_MDB || "123";
// const uri = `mongodb+srv://${usernameMDB}:${passwordMDB}@moon.pb6ql.mongodb.net/?retryWrites=true&w=majority&appName=Moon`;
// const uri=`mongodb+srv://${usernameMDB}:${passwordMDB}@moondb.odrak.mongodb.net/?retryWrites=true&w=majority&appName=moondb`
const uri = `mongodb://${usernameMDB}:${passwordMDB}@10.0.129.33:27017,10.0.145.51:27017,10.0.163.248:27017/moondb?replicaSet=rs0`;
@Module({
  imports: [  
    UsersModule,
    PaypalModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(uri,{
      dbName:"moondb"
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, PayPalService,PaymentsCronService],
})
export class AppModule {}
