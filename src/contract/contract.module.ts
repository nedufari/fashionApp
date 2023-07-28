import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contracts } from '../Entity/contracts.entity';
import { Notifications } from '../Entity/Notification/notification.entity';
import { vendorEntity } from '../Entity/Users/vendor.entity';
import { ModelEntity } from '../Entity/Users/model.entity';
import { PhotographerEntity } from '../Entity/Users/photorapher.entity';
import { ContractService } from './contract.service';
import { ContractController } from './contracts.controller';

@Module({
    imports:[TypeOrmModule.forFeature([Contracts,Notifications,vendorEntity,ModelEntity,PhotographerEntity])],
    providers:[ContractService ],
    controllers:[ContractController]
    
    
})
export class ContractModule {}
