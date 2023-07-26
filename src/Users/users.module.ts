import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
// import {  UserService } from './users.service';
// import { Usercontroller} from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Contracts } from '../Entity/contracts.entity';


@Module({
    imports:[AuthModule,TypeOrmModule.forFeature([Contracts])],
    // providers:[UserService],
    // controllers:[Usercontroller]
 })
export class UserModule {}

