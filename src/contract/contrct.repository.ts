import { EntityRepository, Repository } from "typeorm";
import { Contracts } from "../Entity/contracts.entity";

EntityRepository(Contracts)
export class ContractRepository extends Repository<Contracts>{
    
}