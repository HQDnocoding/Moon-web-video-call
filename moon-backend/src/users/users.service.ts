import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService) { }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }


  async register(registerDto: CreateUserDto): Promise<User> {
    const { email, nickname, password } = registerDto;

    // Kiểm tra user đã tồn tại chưa
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng!');
    }

    // Hash password trước khi lưu vào DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      nickname,
      email,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  async login(email: string, password: string): Promise<{ access_token: string; user_profile:any }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại!');  
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng!');
    }

    const payload = { sub: user._id, email: user.email };
    const access_token = this.jwtService.sign(payload);
    const { password: _, ...profile } = user.toObject();

    return { access_token ,user_profile:profile};
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }
  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async updatePaymentMethod(email: string, subscriptionId: string): Promise<void> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException(`User ${email} not found`);
    user.subscriptionId = subscriptionId;
    await user.save();
  }
  
  async findAllWithVaultToken(): Promise<User[]> {
    return this.userModel.find({ agreementId: { $exists: true, $ne: null } }).exec();
  }

  async calculateMonthlyAmount(email: string, month: string): Promise<string> {
    // const usage = await this.usageModel.findOne({ userEmail: email, month }).exec();
    const usage="10";
    // return usage ? usage.amount.toFixed(2) : "0.00"; // Trả về "0.00" nếu không có dữ liệu
    return usage;
  }

  async updateSubscriptionId(subscriptionId: string, newSubscriptionId: string | null): Promise<UserDocument> {
    // Tìm user có subscriptionId hiện tại và cập nhật
    const user = await this.userModel.findOneAndUpdate(
      { subscriptionId }, // Điều kiện tìm user
      { $set: { subscriptionId: newSubscriptionId } }, // Cập nhật subscriptionId thành null
      { new: true }, // Trả về document sau khi cập nhật
    ).exec();

    if (!user) {
      throw new NotFoundException(`User with subscription ${subscriptionId} not found`);
    }

    return user;
  }
  
}
