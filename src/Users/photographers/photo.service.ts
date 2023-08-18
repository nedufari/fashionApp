import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ContractOfferRepository, CounterContractOfferRepository } from "../../contract/contrct.repository";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { ModelEntityRepository, PhotographerEntityRepository } from "../../auth/auth.repository";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";

@Injectable()
export class PhotographerService{
    constructor(@InjectRepository(ContractsOfffer) private readonly offerripo:ContractOfferRepository,
    @InjectRepository(PhotographerEntity) private readonly photoripo:PhotographerEntityRepository,
    @InjectRepository(CounterContractsOfffer) private readonly counterripo:CounterContractOfferRepository){}

    async getMyoffers(photo: string): Promise<ContractsOfffer[]> {
        const offersForModel = await this.offerripo.find({ where: { photographer: photo } });
        if (!offersForModel || offersForModel.length === 0) {
          throw new HttpException('No offers found for the specified photographer', HttpStatus.NOT_FOUND);
        }
        return offersForModel;
      }
    

    async getMyCounteroffers(photo: string): Promise<CounterContractsOfffer[]> {
        const offersForModel = await this.counterripo.find({ where: { photographer: photo } });
        if (!offersForModel || offersForModel.length === 0) {
          throw new HttpException('No offers found for the specified Photographer', HttpStatus.NOT_FOUND);
        }
        return offersForModel;
      }
    }