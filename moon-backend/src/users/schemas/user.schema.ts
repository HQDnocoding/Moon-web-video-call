import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument=User & Document;
@Schema()
export class User extends Document {
  @Prop({ required: true })
  nickname: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
