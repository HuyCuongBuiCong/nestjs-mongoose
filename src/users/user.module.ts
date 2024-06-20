
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    // imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], 'users') ],
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: User.name,
                useFactory: () => {
                    const schema = UserSchema;
                    schema.pre('save', function () {
                        console.log('Pre save hook');
                    });
                    return schema;
                },
            },

        ], 'users')
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
