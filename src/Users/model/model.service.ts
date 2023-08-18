import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ContractOfferRepository, CounterContractOfferRepository } from "../../contract/contrct.repository";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { ModelEntityRepository } from "../../auth/auth.repository";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";

@Injectable()
export class ModelService{
    constructor(@InjectRepository(ContractsOfffer) private readonly offerripo:ContractOfferRepository,
    @InjectRepository(ModelEntity) private readonly modelripo:ModelEntityRepository,
    @InjectRepository(CounterContractsOfffer) private readonly counterripo:CounterContractOfferRepository){}

    async getMyoffers(model: string): Promise<ContractsOfffer[]> {
        const offersForModel = await this.offerripo.find({ where: { model: model } });
        if (!offersForModel || offersForModel.length === 0) {
          throw new HttpException('No offers found for the specified model', HttpStatus.NOT_FOUND);
        }
        return offersForModel;
      }
    

    async getMyCounteroffers(model: string): Promise<CounterContractsOfffer[]> {
        const offersForModel = await this.counterripo.find({ where: { model: model } });
        if (!offersForModel || offersForModel.length === 0) {
          throw new HttpException('No offers found for the specified model', HttpStatus.NOT_FOUND);
        }
        return offersForModel;
      }
    }