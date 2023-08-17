import { EntityRepository, Repository } from "typeorm";
import { Contracts } from "../Entity/contracts.entity";
import { ContractsOfffer } from "../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../Entity/countercontractOffer.entity";

EntityRepository(Contracts)
export class ContractRepository extends Repository<Contracts>{
    
}

EntityRepository(ContractsOfffer)
export class ContractOfferRepository extends Repository<ContractsOfffer>{
    
}

EntityRepository(CounterContractsOfffer)
export class CounterContractOfferRepository extends Repository<CounterContractsOfffer>{
    
}