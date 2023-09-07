import { Module } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guards';
import { RolesGuard } from './guards/role.guards';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';


import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../Users/users.module';
import { CustomerEntity } from '../Entity/Users/customer.entity';
import { vendorEntity } from '../Entity/Users/vendor.entity';
import { PhotographerEntity } from '../Entity/Users/photorapher.entity';
import { AdminEntity } from '../Entity/Users/admin.entity';
import { Notifications } from '../Entity/Notification/notification.entity';
import { UserOtp } from '../Entity/userotp.entity';
import { ModelEntity } from '../Entity/Users/model.entity';
import { MailService } from '../mailer.service';
import { Comments } from '../Entity/Activities/comment.entity';
import { Replies } from '../Entity/Activities/reply.entity';

@Module({
  providers: [JwtGuard, RolesGuard, JwtStrategy, AuthService,MailService],
  exports:[],
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      vendorEntity,
      PhotographerEntity,
      AdminEntity,
      Notifications,
      UserOtp,
      ModelEntity,
      Comments,
      Replies,    
    ]),
    JwtModule.registerAsync({
        useFactory:()=>({
            secret:process.env.SECRETKEY,
            signOptions:{expiresIn:process.env.EXPIRESIN}
            
        })
    })
  ],
  controllers: [AuthController],
})
export class AuthModule {}
