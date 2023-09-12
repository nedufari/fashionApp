import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contracts } from '../Entity/contracts.entity';
import { Notifications } from '../Entity/Notification/notification.entity';
import { vendorEntity } from '../Entity/Users/vendor.entity';
import { ModelEntity } from '../Entity/Users/model.entity';
import { PhotographerEntity } from '../Entity/Users/photorapher.entity';
import { ContractModelService } from './contract.models.service';
import { ContractController } from './contracts.controller';
// import { ContractPhotographerService } from './contract.photographer.service';
import { ContractsOfffer } from '../Entity/contractoffer.entity';
import { CounterContractsOfffer } from '../Entity/countercontractOffer.entity';
import { ContractPhotographerService } from './contract.photographer.service';
import { QrcodeService } from '../qrcode/qrcode.service';
import { MailService } from '../mailer.service';

@Module({
    imports:[TypeOrmModule.forFeature([Contracts,Notifications,vendorEntity,ModelEntity,PhotographerEntity,ContractsOfffer,CounterContractsOfffer])],
    providers:[ContractModelService,ContractPhotographerService,QrcodeService,MailService ],
    controllers:[ContractController]
    
    
})
export class ContractModule {}
