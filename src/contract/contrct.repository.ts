import { EntityRepository, Repository } from "typeorm";
import { Contracts } from "../Entity/contracts.entity";
import { ContractsOfffer } from "../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../Entity/countercontractOffer.entity";
import { VendorPostsEntity } from "../Entity/Posts/vendor.post.entity";

EntityRepository(Contracts)
export class ContractRepository extends Repository<Contracts>{
    
}

EntityRepository(ContractsOfffer)
export class ContractOfferRepository extends Repository<ContractsOfffer>{
    
}

EntityRepository(CounterContractsOfffer)
export class CounterContractOfferRepository extends Repository<CounterContractsOfffer>{
    
}

EntityRepository(VendorPostsEntity)
export class VendorPostRepository extends Repository<VendorPostsEntity>{
    
}