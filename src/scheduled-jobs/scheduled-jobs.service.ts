import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelEntity } from 'src/Entity/Users/model.entity';
import { vendorEntity } from 'src/Entity/Users/vendor.entity';
import { Contracts } from 'src/Entity/contracts.entity';
import { ModelEntityRepository, VendorEntityRepository } from 'src/auth/auth.repository';
import { ContractRepository } from 'src/contract/contrct.repository';
import { MailService } from 'src/mailer.service';
import { Repository } from 'typeorm';



@Injectable()
export class ScheduledJobsService {

    constructor(
        @InjectRepository(Contracts) private contractRepository: Repository<Contracts>,
        @InjectRepository(vendorEntity) private vendorRepository: VendorEntityRepository,
        @InjectRepository(ModelEntity) private modelRepository: ModelEntityRepository,
        private readonly mailerservice: MailService
    ) { }

    @Cron('*/5 * * * * *')
    async notifyEntitiesForContractExpiry() {

        var i = 0;
        const daysDifference = process.env.DAYS_BEFORE_CONTRACT_EXPIRY_REMINDER;
        console.log("Sabi sabi cron  job...")


        const data = await this.contractRepository.createQueryBuilder('Contracts')
            .where(` expiration_date - CURRENT_DATE   = :daysDifference`, {
                daysDifference
            })
            .getMany();


        for (i = 0; i < data.length; i++) {

            const vendor = await this.vendorRepository.findOne({ where: { brandname: data[i].vendor } })
            if (vendor)
                await this.mailerservice.SendMailForContractExpiryRemider(vendor.email, data[i].contract_duration, data[i].contract_worth, data[i].contract_validity_number, data[i].model, data[i].vendor, data[i].expiration_date)


            const model = await this.modelRepository.findOne({ where: { name: data[i].model } });
            console.log(model)
            if (model)
                await this.mailerservice.SendMailForContractExpiryRemider(model.email, data[i].contract_duration, data[i].contract_worth, data[i].contract_validity_number, data[i].vendor, data[i].model, data[i].expiration_date)

        }

        console.log(data)

    }
}
