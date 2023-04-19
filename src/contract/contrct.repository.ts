import { EntityRepository, Repository } from "typeorm";
import { Contracts } from "../Entity/Actions/contracts.entity";

EntityRepository(Contracts)
export class ContractRepository extends Repository<Contracts>{
    
}