import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contracts, IContractPhotographerResponse } from "../Entity/contracts.entity";
import { vendorEntity } from "../Entity/Users/vendor.entity";
import { PhotographerEntity } from "../Entity/Users/photorapher.entity";
import { ContractRepository } from "./contrct.repository";
import { NotificationsRepository, PhotographerEntityRepository, VendorEntityRepository } from "../auth/auth.repository";
import { Notifications } from "../Entity/Notification/notification.entity";
import { customAlphabet } from "nanoid";
import { NotificationType } from "../Enums/notificationTypes.enum";
import { ContractDto } from "./cotracts.dto";
import { ContractDuration } from "../Enums/contractDuration.enum";
import { add } from 'date-fns';

@Injectable()
export class ContractPhotographerService{
    constructor(@InjectRepository(Contracts)private contractrepository:ContractRepository,
    @InjectRepository(vendorEntity)private vendorrepository:VendorEntityRepository,
    @InjectRepository(PhotographerEntity)private photographerrepository:PhotographerEntityRepository,
    @InjectRepository(Notifications)private notificationrepository:NotificationsRepository){}

    private CVN():string{ 
        const nanoid=customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789',10)
        return nanoid()
      }

        
  private expirationdateforcontract(
    startdate: Date,
    duration: ContractDuration,
  ): Date {
    const startDateObj = new Date(startdate);
    if (!(startDateObj instanceof Date && !isNaN(startDateObj.getTime()))) {
      throw new HttpException(
        `invalid start date ${startdate}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let monthtoadd: number;
    switch (duration) {
      case ContractDuration.ONE_MONTH:
        monthtoadd = 1;
        break;
      case ContractDuration.THREE_MONTHS:
        monthtoadd = 3;
        break;
      case ContractDuration.SIX_MONTHS:
        monthtoadd = 6;
        break;
      case ContractDuration.ONE_YEAR:
        monthtoadd = 12;
        break;
      default:
        throw new HttpException(
          `invalid duration ${duration}`,
          HttpStatus.BAD_REQUEST,
        );
    }
    return add(startdate, { months: monthtoadd });
  }


         //contract between vendor and model 
    async ContractBtwnPhotographerandVendor(vendorid:string, photoid:string, contractdto:ContractDto):Promise<IContractPhotographerResponse>{
        try {
          //verify the ids of both the model and the vendor 
          const vendor = await this.vendorrepository.findOne({where:{VendorID:vendorid}})
          if (!vendor) throw new HttpException(`you are not a legitimate vendor on this platform and therefore you cannot proceed with this contract agreement`,HttpStatus.NOT_FOUND)
          const photographer = await this.photographerrepository.findOne({where:{PhotographerID:photoid}})
          if (!photographer) throw new HttpException(`you are not a legitimate photographer on this platform and therefore you cannot proceed with this contract agreement`,HttpStatus.NOT_FOUND)
  
          //proceed to contract signature and agreement 
          const contract = new Contracts()
          contract.vendor= vendor.brandname
          contract.photographer=photographer.username
          contract.contract_worth=contractdto.contract_worth
          contract.contract_duration=contractdto.contract_duration
          contract.commence_date= new Date()
          contract.expiration_date=this.expirationdateforcontract(contract.commence_date,contract.contract_duration),
          contract.contract_validity_number=this.CVN()
          await this.contractrepository.save(contract)
  
          //save the notification 
        const notification = new Notifications()
        notification.account= contract.contract_validity_number
        notification.subject="New Contract Signed!"
        notification.notification_type=NotificationType.CONTRACT_SIGNED
        notification.message=`Hello a contract has been signed between  ${vendor.brandname} and ${photographer.username} for a duration of ${contractdto.contract_duration} worth ${contractdto.contract_worth} which starts ${contract.commence_date} and expires on ${contract.expiration_date}, Thnaks`
        await this.notificationrepository.save(notification)
  
        //update the model table 
        
         photographer.is_on_contract=true
         await this.photographerrepository.save(photographer)
  
         //response      
         const contractresponse:IContractPhotographerResponse={
          vendor:contract.vendor,
          photographer:contract.photographer,
          contract_duration:contract.contract_duration,
          contract_worth:contract.contract_worth,
          contract_validity_number:contract.contract_validity_number,
          commence_date:contract.commence_date,
          expiration_date:contract.expiration_date,
         };
         return contractresponse
         
        } catch (error) {
          throw error
        }
      
      }
}

