import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from'dotenv'

dotenv.config()
const usernameMDB:string=process.env.USERNAME_MDB || "defaultUsername";
const passwordMDB:string=process.env.PASSWORD_MDB || "defaultPassword";
// const uri = `mongodb+srv://${usernameMDB}:${passwordMDB}@moon.pb6ql.mongodb.net/?retryWrites=true&w=majority&appName=Moon`;
const uri=`mongodb+srv://${usernameMDB}:${passwordMDB}@moondb.odrak.mongodb.net/?retryWrites=true&w=majority&appName=moondb`
@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(uri,{
      dbName:"moondb"
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
