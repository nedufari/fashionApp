import { Module } from '@nestjs/common';
import { TypeormModules } from './typeorm/typeorm.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmService } from './typeorm/typeorm.service';
import { ContractModule } from './contract/contract.module';
import { UserModule } from './Users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mailer.service';
import { AdminModule } from './Users/admin/admin.module';


@Module({
  imports: [
    TypeormModules,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({useClass:TypeOrmService}),
    ContractModule,
    AdminModule,
    MailerModule.forRoot({
      transport:{
        service:"gmail",
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS,
        },
      }
    })
  
  ],
  providers:[MailService]
})
export class AppModule {}
