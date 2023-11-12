import { Module } from '@nestjs/common';
import { ScheduledJobsService } from './scheduled-jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contracts } from 'src/Entity/contracts.entity';
import { MailService } from 'src/mailer.service';
import { vendorEntity } from 'src/Entity/Users/vendor.entity';
import { ModelEntity } from 'src/Entity/Users/model.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contracts, vendorEntity, ModelEntity]), 
  ],
  providers: [ScheduledJobsService,MailService ]
})
export class ScheduledJobsModule {}
