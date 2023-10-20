import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contracts, IContractPhotographerResponse } from "../Entity/contracts.entity";
import { vendorEntity } from "../Entity/Users/vendor.entity";
import { PhotographerEntity } from "../Entity/Users/photorapher.entity";
import { ContractOfferRepository, ContractRepository, CounterContractOfferRepository } from "./contrct.repository";
import { NotificationsRepository, PhotographerEntityRepository, VendorEntityRepository } from "../auth/auth.repository";
import { Notifications } from "../Entity/Notification/notification.entity";
import { customAlphabet } from "nanoid";
import { NotificationType } from "../Enums/notificationTypes.enum";
import { AcceptContractofferDto, ContractDto, CounterOfferDto } from "./cotracts.dto";
import { ContractDuration, ContractOfferResponse, ContractOfferStatus, TypeOfContract } from "../Enums/contract.enum";
import { add } from 'date-fns';
import { ContractsOfffer, IContractOfferPhotographerResponse } from "../Entity/contractoffer.entity";
import { CounterContractsOfffer, ICounterContractOfferPhotographerResponse } from "../Entity/countercontractOffer.entity";
import { MailService } from "../mailer.service";

@Injectable()
export class ContractPhotographerService{
    constructor(@InjectRepository(Contracts)private contractrepository:ContractRepository,
    @InjectRepository(ContractsOfffer)private contractsofferrepository:ContractOfferRepository,
    @InjectRepository(CounterContractsOfffer)private countercontractsofferrepository:CounterContractOfferRepository,
    @InjectRepository(vendorEntity)private vendorrepository:VendorEntityRepository,
    @InjectRepository(PhotographerEntity)private photographerrepository:PhotographerEntityRepository,
    @InjectRepository(Notifications)private notificationrepository:NotificationsRepository,
    
    private readonly mailerservice:MailService){}

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




     //send contract offer either from the model to the vendor or from the vendor to the model
async sendcontractoffer(vendorid: string, photoid: string, contractdto: ContractDto):Promise<IContractOfferPhotographerResponse>{
    try {
      const vendor = await this.vendorrepository.findOne({where:{id:vendorid}})
      if (!vendor) throw new HttpException(`you are not a legitimate vendor on this platform and therefore you cant perform this action`,HttpStatus.NOT_FOUND)
  
      // Check if the model has a contract
      const photographer = await this.photographerrepository.findOne({ where: { id: photoid } });
      if (!photographer) throw new HttpException(`you are not a legitimate photographer on this platform and therefore you cannot perform this task`, HttpStatus.NOT_FOUND);
  
      if (photographer.type_of_contract === TypeOfContract.EXCLUSIVE_CONTRACT && contractdto.type_of_contract === TypeOfContract.EXCLUSIVE_CONTRACT) {
        throw new HttpException(`Sorry, ${vendor.brandname}, you can't send a contract offer to this, ${photographer.username} because she has an exclusive contract. Until the contract expires, the model cant recieve any offers.`, HttpStatus.NOT_ACCEPTABLE);
      }
  
      //if the model has an open contract, proceed to send the offer to the model or to the vendor as the case might be
      if (photographer.type_of_contract === TypeOfContract.OPEN_CONTRACT){
        const contractoffer = new ContractsOfffer()
        contractoffer.contract_duration = contractdto.contract_duration
        contractoffer.contract_worth = contractdto.contract_worth
        contractoffer.type_of_contract= contractdto.type_of_contract
        contractoffer.photographer = photographer.username
        contractoffer.vendor = vendor.brandname
        contractoffer.contract_offer_id = this.CVN()
        contractoffer.sent_at = new Date()
        contractoffer.status = ContractOfferStatus.PENDING
        await this.contractsofferrepository.save(contractoffer)
  
        //save the notification 
        const notification = new Notifications()
        notification.account= contractoffer.id
        notification.subject="contract offer Sent!"
        notification.notification_type=NotificationType.CONTRACT_OFFER_SENT
        notification.message=`Hello a contract offer  has been initialized between  ${vendor.brandname} and ${photographer.username} for a duration of ${contractdto.contract_duration} worth ${contractdto.contract_worth} Thnaks`
        await this.notificationrepository.save(notification)
  
        const offerresponse: IContractOfferPhotographerResponse = {
          vendor: contractoffer.vendor,
          photographer: contractoffer.model,
          contract_duration: contractoffer.contract_duration,
          contract_worth: contractoffer.contract_worth,
          type_of_contract: contractoffer.type_of_contract,
          contract_offer_id: contractoffer.contract_offer_id,
          sent_at: contractoffer.sent_at,
          status: contractoffer.status
         
        };
        return offerresponse;
        
      }
  
       // If the model has an exclusive contract, prevent the contract offer from being sent 
       if (photographer.type_of_contract === TypeOfContract.EXCLUSIVE_CONTRACT) {
        throw new HttpException(`Sorry, ${vendor.brandname}, you can't send a contract offer to this photographer ${photographer.username} because the model has an exclusive contract. Until the contract expires, this model can't be signed or offered a contract by anyone else.`, HttpStatus.NOT_ACCEPTABLE);
      }
  
  
      // If the model has no contract, send the offer
      if (!photographer.type_of_contract){
        const contractoffer = new ContractsOfffer()
        contractoffer.contract_duration = contractdto.contract_duration
        contractoffer.contract_worth = contractdto.contract_worth
        contractoffer.type_of_contract= contractdto.type_of_contract
        contractoffer.photographer = photographer.username
        contractoffer.vendor = vendor.brandname
        contractoffer.contract_offer_id = this.CVN()
        contractoffer.sent_at = new Date()
        contractoffer.status =  ContractOfferStatus.PENDING
        await this.contractsofferrepository.save(contractoffer)
  
  
          //save the notification 
          const notification = new Notifications()
          notification.account= contractoffer.id
          notification.subject="contract offer Sent!"
          notification.notification_type=NotificationType.CONTRACT_OFFER_SENT
          notification.message=`Hello a contract offer  has been initialized between  ${vendor.brandname} and ${photographer.username} for a duration of ${contractdto.contract_duration} worth ${contractdto.contract_worth} Thnaks`
          await this.notificationrepository.save(notification)
    
          const offerresponse: IContractOfferPhotographerResponse = {
            vendor: contractoffer.vendor,
            photographer: contractoffer.photographer,
            contract_duration: contractoffer.contract_duration,
            contract_worth: contractoffer.contract_worth,
            type_of_contract: contractoffer.type_of_contract,
            contract_offer_id: contractoffer.contract_offer_id,
            sent_at: contractoffer.sent_at,
            status :contractoffer.status
            
           
          };
          return offerresponse;
      }
  
              
  
      
    } catch (error) {
      throw error
      
    }
  
  }
  
  
  
  //acceept or decline the offer or send a counter offer 
  
  async AcceptContractOfferORDecline(vendorid: string, photoid: string, coi:string, acceptcontractdto: AcceptContractofferDto): Promise<IContractPhotographerResponse>{
    try {
      const vendor = await this.vendorrepository.findOne({where:{id:vendorid}})
      if (!vendor) throw new HttpException(`you are not a legitimate vendor on this platform and therefore you cant perform this action`,HttpStatus.NOT_FOUND)
      console.log(vendor.brandname)
  
      // Check if the model has a contract
      const photographer = await this.photographerrepository.findOne({ where: { id: photoid } });
      if (!photographer) throw new HttpException(`you are not a legitimate photographer on this platform and therefore you cannot perform this task`, HttpStatus.NOT_FOUND);
  
  
      //check vendors and models oaccross the contractoffer table with the coi number too
      const isPhotographer = await this.contractsofferrepository.findOne({where:{photographer:photographer.username}})
      const isVendor = await this.contractsofferrepository.findOne({where:{vendor:vendor.brandname}})
      const isCoi= await this.contractsofferrepository.findOne({where:{contract_offer_id:coi}})
  
      if (!isPhotographer|| !isVendor || !isCoi) throw new HttpException ('the parties involved in this contract are not valid',HttpStatus.NOT_ACCEPTABLE)
  
     
      if (acceptcontractdto.response == ContractOfferResponse.AGREED){
  
         // Proceed to contract signature and agreement
         const contract = new Contracts();
         contract.vendor = vendor.brandname;
         contract.photographer = photographer.username;
         contract.contract_worth = isCoi.contract_worth;
         contract.contract_duration = isCoi.contract_duration;
         contract.type_of_contract = isCoi.type_of_contract;
         contract.commence_date = new Date();
         contract.expiration_date = this.expirationdateforcontract(contract.commence_date, contract.contract_duration);
         contract.contract_validity_number = this.CVN();
         contract.status = ContractOfferStatus.ACCEPTED
         await this.contractrepository.save(contract);
  
         //update the offertable
         isCoi.isAccepted= true
         isCoi.status = ContractOfferStatus.ACCEPTED
         await this.contractsofferrepository.save(isCoi)
   
         //update the model table and save 
   
         photographer.type_of_contract = isCoi.type_of_contract; // Update the contractType in the Model table
         photographer.is_onContract = true; // Update the is_on_contract field as needed
         await this.photographerrepository.save(photographer);

         //generate qrcode for the contract 
      //  const qrCodeDataUrl =await this.qrcodeservice.generateContractQrCode(contract)

       //send mail to photographer 
       await this.mailerservice.SendMailtoPhotographerVendor(vendor.email,contract.contract_duration,contract.contract_worth,contract.contract_validity_number,isPhotographer.photographer,isVendor.vendor,contract.expiration_date)

       //send mail to vendor 
       await this.mailerservice.SendMailtoVendorPhotographer(vendor.email,contract.contract_duration,contract.contract_worth,contract.contract_validity_number,isPhotographer.photographer,isVendor.vendor,contract.expiration_date)
  
          //save the notification 
          const notification = new Notifications()
          notification.account= contract.contract_validity_number
          notification.subject="New Contract Signed!"
          notification.notification_type=NotificationType.CONTRACT_SIGNED
          notification.message=`Hello a contract has been signed between  ${vendor.brandname} and ${photographer.username} for a duration of ${contract.contract_duration} worth ${contract.contract_worth} which starts ${contract.commence_date} and expires on ${contract.expiration_date}, Thnaks`
          await this.notificationrepository.save(notification)
    
  
       const contractresponse: IContractPhotographerResponse = {
         vendor: contract.vendor,
         photographer: contract.photographer,
         contract_duration: contract.contract_duration,
         contract_worth: contract.contract_worth,
         type_of_contract: contract.type_of_contract,
         contract_validity_number: contract.contract_validity_number,
         commence_date: contract.commence_date,
         expiration_date: contract.expiration_date,
         status : contract.status
       };
       return contractresponse;
      }
  
    //send counter offer if you choose 
    
        if (acceptcontractdto.response == ContractOfferResponse.TURNED_DOWN ){
  
        
        //send notifaction to the vendor that the contract extendion was refused 
        const declinedMessage="i am sorry i can't accept this offer, please lets contine with what we have or you can send in a better offer"
        isCoi.status = ContractOfferStatus.DECLINED
        await this.contractsofferrepository.save(isCoi)
  
       //save the notification 
  
        const notification = new Notifications()
        notification.account= photographer.id || vendor.id
        notification.subject="New Contract offer declined!"
        notification.notification_type=NotificationType.CONTRACT_OFFER_DECLINED
        notification.message=`Hello a contract  offer  between  ${vendor.brandname} and ${photographer.username} for an extended duration of  has been declined`
        await this.notificationrepository.save(notification)
  
        throw new HttpException(declinedMessage,HttpStatus.OK)
        }
    
      
    } catch (error) {
      throw error
      
    }
  
  
  }
  
  
  async countercontrctOffer(vendorid:string, modelid:string,coi:string,counterofferdto:CounterOfferDto):Promise<ICounterContractOfferPhotographerResponse>{
    try {
      const vendor = await this.vendorrepository.findOne({where:{id:vendorid}})
      if (!vendor) throw new HttpException(`you are not a legitimate vendor on this platform and therefore you cant perform this action`,HttpStatus.NOT_FOUND)
      console.log(vendor.brandname)
  
      // Check if the model has a contract
      const photographer = await this.photographerrepository.findOne({ where: { id: modelid } });
      if (!photographer) throw new HttpException(`you are not a legitimate photographer on this platform and therefore you cannot perform this task`, HttpStatus.NOT_FOUND);
  
  
      //check vendors and models oaccross the contractoffer table with the coi number too
      const isPhotographer = await this.contractsofferrepository.findOne({where:{photographer:photographer.username}})
      const isVendor = await this.contractsofferrepository.findOne({where:{vendor:vendor.brandname}})
      const isCoi= await this.contractsofferrepository.findOne({where:{contract_offer_id:coi}})
  
      if (!isPhotographer|| !isVendor || !isCoi) throw new HttpException ('the parties involved in this contract are not valid',HttpStatus.NOT_ACCEPTABLE)
  
      const counteroffer = new CounterContractsOfffer()
      counteroffer.contract_duration = counterofferdto.counter_duration
      counteroffer.contract_worth = counterofferdto.counter_worth
      counteroffer.isCountered = true
      counteroffer.message = counterofferdto.message
      counteroffer.type_of_contract = counterofferdto.type_of_contract
      counteroffer.sent_at = new Date()
      counteroffer.photographer = isPhotographer.photographer
      counteroffer.vendor = isVendor.vendor
      counteroffer.status = ContractOfferStatus.PENDING
      counteroffer.contract_counteroffer_id = this.CVN()
      await this.countercontractsofferrepository.save(counteroffer)

      //update the offertable 
      isCoi.isCountered = true
      isCoi.status = ContractOfferStatus.COUNTERED
      await this.contractsofferrepository.save(isCoi)
  
      const counterresponse: ICounterContractOfferPhotographerResponse= {
        vendor: counteroffer.vendor,
        photographer: counteroffer.photographer,
        contract_duration: counteroffer.contract_duration,
        contract_worth: counteroffer.contract_worth,
        type_of_contract: counteroffer.type_of_contract,
        contract_counteroffer_id : counteroffer.contract_counteroffer_id,
        status : counteroffer.status,
        sent_at : counteroffer.sent_at
      };
  
      const notification = new Notifications()
            notification.account= counteroffer.contract_counteroffer_id
            notification.subject="New Contract counter offer sent!"
            notification.notification_type=NotificationType.CONTRACT_COUNTER_OFFER_SENT
            notification.message=`Hello a contract offer between  ${vendor.brandname} and ${photographer.username} has been been countered by the model with an offer of ${counteroffer.contract_duration} with a worth of ${counteroffer.contract_worth}`
            await this.notificationrepository.save(notification)
  
      
      return counterresponse;
  
  
    } catch (error) {
      
    }
  
  }
  
  async AcceptCounterContractOfferORDecline(vendorid: string, photoid: string, coi:string, acceptcontractdto: AcceptContractofferDto): Promise<IContractPhotographerResponse>{
    try {
      const vendor = await this.vendorrepository.findOne({where:{id:vendorid}})
      if (!vendor) throw new HttpException(`you are not a legitimate vendor on this platform and therefore you cant perform this action`,HttpStatus.NOT_FOUND)
      console.log(vendor.brandname)
  
      // Check if the model has a contract
      const photographer = await this.photographerrepository.findOne({ where: { id: photoid } });
      if (!photographer) throw new HttpException(`you are not a legitimate photographer on this platform and therefore you cannot perform this task`, HttpStatus.NOT_FOUND);
  
  
      //check vendors and models oaccross the contractoffer table with the coi number too
      const isPhotographer = await this.countercontractsofferrepository.findOne({where:{photographer:photographer.username}})
      const isVendor = await this.countercontractsofferrepository.findOne({where:{vendor:vendor.brandname}})
      const isCoi= await this.countercontractsofferrepository.findOne({where:{contract_counteroffer_id:coi}})
  
      if (!isPhotographer|| !isVendor || !isCoi) throw new HttpException ('the parties involved in this contract are not valid',HttpStatus.NOT_ACCEPTABLE)
  
     
      if (acceptcontractdto.response == ContractOfferResponse.AGREED){
  
         // Proceed to contract signature and agreement
         const contract = new Contracts();
         contract.vendor = vendor.brandname;
         contract.photographer = photographer.username;
         contract.contract_worth = isCoi.contract_worth;
         contract.contract_duration = isCoi.contract_duration;
         contract.type_of_contract = isCoi.type_of_contract;
         contract.commence_date = new Date();
         contract.expiration_date = this.expirationdateforcontract(contract.commence_date, contract.contract_duration);
         contract.contract_validity_number = this.CVN();
         contract.status = ContractOfferStatus.ACCEPTED
         await this.contractrepository.save(contract);
  
         //update the offertable
         isCoi.isCountered= false
         isCoi.status = ContractOfferStatus.ACCEPTED
         await this.countercontractsofferrepository.save(isCoi)
   
         //update the model table and save 
   
         photographer.type_of_contract = isCoi.type_of_contract; // Update the contractType in the Model table
         photographer.is_onContract = true; // Update the is_on_contract field as needed
         await this.photographerrepository.save(photographer);

          //send mail to photographer 
       await this.mailerservice.SendMailtoPhotographerVendor(vendor.email,contract.contract_duration,contract.contract_worth,contract.contract_validity_number,isPhotographer.photographer,isVendor.vendor,contract.expiration_date)

       //send mail to vendor 
       await this.mailerservice.SendMailtoVendorPhotographer(vendor.email,contract.contract_duration,contract.contract_worth,contract.contract_validity_number,isPhotographer.photographer,isVendor.vendor,contract.expiration_date)
  
  
          //save the notification 
          const notification = new Notifications()
          notification.account= contract.contract_validity_number
          notification.subject="New Contract Signed and counter offer Accepted!"
          notification.notification_type=NotificationType.CONTRACT_COUNTER_OFFER_ACCEPTED
          notification.message=`Hello a contract has been signed between  ${vendor.brandname} and ${photographer.username} for a duration of ${contract.contract_duration} worth ${contract.contract_worth} which starts ${contract.commence_date} and expires on ${contract.expiration_date}, Thnaks`
          await this.notificationrepository.save(notification)
    
  
       const contractresponse: IContractPhotographerResponse = {
         vendor: contract.vendor,
         photographer: contract.model,
         contract_duration: contract.contract_duration,
         contract_worth: contract.contract_worth,
         type_of_contract: contract.type_of_contract,
         contract_validity_number: contract.contract_validity_number,
         commence_date: contract.commence_date,
         expiration_date: contract.expiration_date,
         status : contract.status
       };
       return contractresponse;
      }
  
    //send counter offer if you choose 
    
        if (acceptcontractdto.response == ContractOfferResponse.TURNED_DOWN ){
  
        
        //send notifaction to the vendor that the contract extendion was refused 
        const declinedMessage="i am sorry i can't accept this offer, please lets continue with what we have or you can send in a better offer"
        isCoi.status = ContractOfferStatus.DECLINED
        await this.contractsofferrepository.save(isCoi)
  
       //save the notification 
  
        const notification = new Notifications()
        notification.account= photographer.id || vendor.id
        notification.subject="New Counter Contract  offer declined!"
        notification.notification_type=NotificationType.CONTRACT_COUNTER_OFFER_DECLINED
        notification.message=`Hello a contract  offer  between  ${vendor.brandname} and ${photographer.username} for an extended duration of  has been declined`
        await this.notificationrepository.save(notification)
  
        throw new HttpException(declinedMessage,HttpStatus.OK)
        }
    
      
    } catch (error) {
      throw error
      
    }
  
  
  }

}
//        