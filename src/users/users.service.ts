import { Model, Connection } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import {User, UserDocument, UserSchema} from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private userModel: Model<User>;

    constructor(
        @InjectConnection('users') private readonly connection: Connection,
    ) {
        this.userModel = this.connection.model(User.name, UserSchema);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }

    async delete(id: string): Promise<User> {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
