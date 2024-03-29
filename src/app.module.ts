import { Module } from '@nestjs/common';
import { TypeormModules } from './typeorm/typeorm.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmService } from './typeorm/typeorm.service';
import { ContractModule } from './contract/contract.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mailer.service';
import { AdminModule } from './Users/admin/admin.module';
import { VendorModule } from './Users/vendor/vendor.module';
import { ModelModule } from './Users/model/model.module';
import { PhotographerModule } from './Users/photographers/photo.module';
import { CustomerModule } from './Users/customers/customers.module';
import { WalletModule } from './Wallet/wallet.module';
import { UploadService } from './uploads.service';
import { PaymentModule } from './payment/payment.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledJobsModule } from './scheduled-jobs/scheduled-jobs.module';


@Module({
  imports: [
    TypeormModules, 
    AuthModule,
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({useClass:TypeOrmService}),
    ContractModule,
    AdminModule,
    VendorModule,
    ModelModule,
    PhotographerModule,
    CustomerModule,
    WalletModule,
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
    }),
    
    PaymentModule,
    ScheduleModule.forRoot(),
    ScheduledJobsModule
    
  
  ],
  providers:[MailService,UploadService,AppService],
  controllers:[AppController],
  exports:[UploadService,]
})
export class AppModule {}
