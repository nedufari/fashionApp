import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contracts, IContract, IContractModelResponse, IContractPhotographerResponse } from "../Entity/contracts.entity";
import { ContractRepository } from "./contrct.repository";
import { vendorEntity } from "../Entity/Users/vendor.entity";
import { ModelEntityRepository, NotificationsRepository, PhotographerEntityRepository, VendorEntityRepository } from "../auth/auth.repository";
import { PhotographerEntity } from "../Entity/Users/photorapher.entity";
import { ModelEntity } from "../Entity/Users/model.entity";
import { AcceptContractTermoinationRequestDto, AcceptContractofferDto, ContractDto, CounterOfferDto, ExtendContractDto, TerminateDto } from "./cotracts.dto";
import { IVendor } from "../Users/vendor/vendor.interface";
import { IModel } from "../Users/model/model.interface";
import { ContractDuration } from "../Enums/contractDuration.enum";
import { customAlphabet, nanoid } from "nanoid";
import { Notifications } from "../Entity/Notification/notification.entity";
import { NotificationType } from "../Enums/notificationTypes.enum";
import { add } from 'date-fns';
@Injectable()
export class ContractModelService{
    constructor(@InjectRepository(Contracts)private contractrepository:ContractRepository,
    @InjectRepository(vendorEntity)private vendorrepository:VendorEntityRepository,
    @InjectRepository(PhotographerEntity)private photographerrepository:PhotographerEntityRepository,
    @InjectRepository(ModelEntity)private modelrepository:ModelEntityRepository,
    @InjectRepository(Notifications)private notificationrepository:NotificationsRepository){}


    //contract validity number 
    private CVN():string{ 
      const nanoid=customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789',10)
      return nanoid()
    }
 





      //contract between vendor and model 
      async ContractBtwnModelandVendor(vendorid:string, modelid:string, contractdto:ContractDto):Promise<IContractModelResponse>{
        try {
          //verify the ids of both the model and the vendor 
          const vendor = await this.vendorrepository.findOne({where:{VendorID:vendorid}})
          if (!vendor) throw new HttpException(`you are not a legitimate vendor on this platform and therefore you cannot proceed with this contract agreement`,HttpStatus.NOT_FOUND)
          const model = await this.modelrepository.findOne({where:{ModelID:modelid}})
          if (!model) throw new HttpException(`you are not a legitimate model on this platform and therefore you cannot proceed with this contract agreement`,HttpStatus.NOT_FOUND)
  
          //proceed to contract signature and agreement 
          const contract = new Contracts()
          contract.vendor= vendor.brandname
          contract.model=model.username
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
        notification.message=`Hello a contract has been signed between  ${vendor.brandname} and ${model.username} for a duration of ${contractdto.contract_duration} worth ${contractdto.contract_worth} which starts ${contract.commence_date} and expires on ${contract.expiration_date}, Thnaks`
        await this.notificationrepository.save(notification)
  
        //update the model table

         model.is_on_contract=true
         await this.modelrepository.save(model)
  
         //response 
         const contractresponse:IContractModelResponse={
          vendor:contract.vendor,
          model:contract.model,
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


      //contract extention from vendor to model and counter offer from the model to the contract and also accepting or declining the offer

      async ContractExtensionfromVendorToModel(extentiondto:ExtendContractDto,contractId:string,vendorid:string, modelid:string,){
        try {

          const contract = await this.contractrepository.findOne({where:{contract_validity_number:contractId}})
        if(!contract) throw new HttpException('the contract is not found',HttpStatus.NOT_FOUND)
        const vendor = await this.vendorrepository.findOne({where:{VendorID:vendorid}})
          if (!vendor) throw new HttpException(`you are not a legitimate vendor on this platform and therefore you cannot proceed with this contract agreement`,HttpStatus.NOT_FOUND)
          const model = await this.modelrepository.findOne({where:{ModelID:modelid}})
          if (!model) throw new HttpException(`you are not a legitimate model on this platform and therefore you cannot proceed with this contract agreement`,HttpStatus.NOT_FOUND)
  

        //place the offer and save temporarily
        contract.contract_duration_extension_offer=extentiondto.extended_contract_duration_offer
        contract.contract_worth_extension_offer=extentiondto.extended_contract_worth_offer
        await this.contractrepository.save(contract)

           //save the notification 
           const notification = new Notifications()
           notification.account= contract.contract_validity_number
           notification.subject="New Contract Extention sent!"
           notification.notification_type=NotificationType.CONTRACT_EXTENSION_OFFER_SENT
           notification.message=`Hello a contract extension offer  has been sent by  ${vendor.brandname} to ${model.username} for an extended duration of ${extentiondto.extended_contract_duration_offer} with an improved worth of ${extentiondto.extended_contract_worth_offer}`
           await this.notificationrepository.save(notification)
          
        } catch (error) {
          throw error
        }
      }




      async AcceptOfferFromVendorByModel(contractid:string,vendorid:string, modelid:string,acceptofferdto:AcceptContractofferDto,counteroffer?:CounterOfferDto,):Promise<IContractModelResponse>{
        try {
          const contract = await this.contractrepository.findOne({where:{contract_validity_number:contractid}})
        if(!contract) throw new HttpException('the contract is not found',HttpStatus.NOT_FOUND)
        const vendor = await this.vendorrepository.findOne({where:{VendorID:vendorid}})
        if (!vendor) throw new HttpException(`you are not a legitimate vendor on this platform and therefore you cannot proceed with this contract agreement`,HttpStatus.NOT_FOUND)
        const model = await this.modelrepository.findOne({where:{ModelID:modelid}})
        if (!model) throw new HttpException(`you are not a legitimate model on this platform and therefore you cannot proceed with this contract agreement`,HttpStatus.NOT_FOUND)


        //check for contract extension first 
        if (!contract.contract_duration_extension_offer||contract.contract_worth_extension_offer) throw new HttpException('no contract extenson offers ',HttpStatus.BAD_REQUEST)

        //accept or decline 
        if (acceptofferdto.isAccepted){
          contract.contract_duration=contract.contract_duration_extension_offer
          contract.contract_worth=contract.contract_worth_extension_offer
          contract.commence_date= new Date()
          contract.expiration_date=this.expirationdateforcontract(contract.commence_date, contract.contract_duration)
          contract.contract_duration_extension_offer=null
          contract.contract_worth_extension_offer=null
          await this.contractrepository.save(contract)

          //save the notification 
          const notification = new Notifications()
          notification.account= contract.contract_validity_number
          notification.subject="New Contract extension offer accepted!"
          notification.notification_type=NotificationType.CONTRACT_EXTENSION_ACCEPTED
          notification.message=`Hello a contract extension offer sent by  ${vendor.brandname} to ${model.username} for an extended duration of ${contract.contract_duration_extension_offer} with an improved worth of ${contract.contract_worth_extension_offer} has been accepted and the contract would now expire at ${contract.expiration_date}`
          await this.notificationrepository.save(notification)

        }
        else{
          //send a counter offer 

          if (counteroffer){
            contract.contract_worth=counteroffer.counter_worth
            contract.contract_duration=counteroffer.counter_duration
            await this.contractrepository.save(contract)

            const notification = new Notifications()
            notification.account= contract.contract_validity_number
            notification.subject="New Contract Extention counter offer sent!"
            notification.notification_type=NotificationType.CONTRACT_EXTENSION_COUNTER_OFFER_SENT
            notification.message=`Hello a contract extension offer sent by  ${vendor.brandname} to ${model.username} for an extended duration of ${contract.contract_duration_extension_offer} with an improved worth of ${contract.contract_worth_extension_offer} has been been countered by the model with an offer of ${counteroffer.counter_duration} with a worth of ${counteroffer.counter_worth}`
            await this.notificationrepository.save(notification)
          }

          else{
            //send notifaction to the vendor that the contract extendion was refused 
            const declinedMessage="i am sorry i can't accept this offer, please lets contine with what we have or you can send in a better offer"

           //save the notification 

            const notification = new Notifications()
            notification.account= contract.contract_validity_number
            notification.subject="New Contract Extention offer declined!"
            notification.notification_type=NotificationType.CONTRACT_EXTENSION_ACCEPTED
            notification.message=`Hello a contract extension offer sent by  ${vendor.brandname} to ${model.username} for an extended duration of ${contract.contract_duration_extension_offer} with an improved worth of ${contract.contract_worth_extension_offer} has been declined and the initial contract agreement remains unchanged`
            await this.notificationrepository.save(notification)

            throw new HttpException(declinedMessage,HttpStatus.BAD_REQUEST)
          }
        }

          //response 
          const updatedcontractresponse:IContractModelResponse={
            vendor:contract.vendor,
            model:contract.model,
            contract_duration:contract.contract_duration,
            contract_worth:contract.contract_worth,
            contract_validity_number:contract.contract_validity_number,
            commence_date:contract.commence_date,
            expiration_date:contract.expiration_date,
           };
           return updatedcontractresponse  
      }
          
         catch (error) {
          throw error 
          
        }
        
      }




      async AcceptCounterofferFromModelToVendor(contractid:string,vendorid:string, modelid:string,acceptofferdto:AcceptContractofferDto,counteroffer?:CounterOfferDto,):Promise<IContractModelResponse>{
        try {
          const contract = await this.contractrepository.findOne({where:{contract_validity_number:contractid}})
        if(!contract) throw new HttpException('the contract is not found',HttpStatus.NOT_FOUND)
        const vendor = await this.vendorrepository.findOne({where:{VendorID:vendorid}})
        if (!vendor) throw new HttpException(`you are not a legitimate vendor on this platform and therefore you cannot proceed with this contract agreement`,HttpStatus.NOT_FOUND)
        const model = await this.modelrepository.findOne({where:{ModelID:modelid}})
        if (!model) throw new HttpException(`you are not a legitimate model on this platform and therefore you cannot proceed with this contract agreement`,HttpStatus.NOT_FOUND)


        //check for contract extension first 
        if (!contract.contract_duration_extension_offer||contract.contract_worth_extension_offer) throw new HttpException('no contract extenson offers ',HttpStatus.BAD_REQUEST)

        //accept or decline 
        if (acceptofferdto.isAccepted){
          contract.contract_duration=contract.contract_duration_extension_offer
          contract.contract_worth=contract.contract_worth_extension_offer
          contract.commence_date= new Date()
          contract.expiration_date=this.expirationdateforcontract(contract.commence_date, contract.contract_duration)
          contract.contract_duration_extension_offer=null
          contract.contract_worth_extension_offer=null
          contract.contract_counter_offer_accepted=true
          await this.contractrepository.save(contract)

          //save the notification 
          const notification = new Notifications()
          notification.account= contract.contract_validity_number
          notification.subject="New Contract extension counter offer from model to vendor  is accepted!"
          notification.notification_type=NotificationType.CONTRACT_EXTENSION_ACCEPTED
          notification.message=`Hello a contract extension offer sent by  ${vendor.brandname} to ${model.username} for an extended duration of ${contract.contract_duration_extension_offer} with an improved worth of ${contract.contract_worth_extension_offer} has been accepted and the contract would now expire at ${contract.expiration_date}`
          await this.notificationrepository.save(notification)

        }
        else{
          //send a counter offer 

          if (counteroffer){
            contract.contract_worth=counteroffer.counter_worth
            contract.contract_duration=counteroffer.counter_duration
            await this.contractrepository.save(contract)

            const notification = new Notifications()
            notification.account= contract.contract_validity_number
            notification.subject="New Contract Extention counter offer sent!"
            notification.notification_type=NotificationType.CONTRACT_EXTENSION_COUNTER_OFFER_SENT
            notification.message=`Hello a contract extension offer sent by  ${vendor.brandname} to ${model.username} for an extended duration of ${contract.contract_duration_extension_offer} with an improved worth of ${contract.contract_worth_extension_offer} has been been countered by the vendor with an offer of ${counteroffer.counter_duration} with a worth of ${counteroffer.counter_worth}`
            await this.notificationrepository.save(notification)
          }

          else{
            //send notifaction to the vendor that the contract extendion was refused 
            const declinedMessage="i am sorry i can't accept this offer, please lets contine with what we have or you can send in a better counter offer"

           //save the notification 

            const notification = new Notifications()
            notification.account= contract.contract_validity_number
            notification.subject="New Contract Extention offer declined!"
            notification.notification_type=NotificationType.CONTRACT_EXTENSION_ACCEPTED
            notification.message=`Hello a contract extension offer sent by  ${vendor.brandname} to ${model.username} for an extended duration of ${contract.contract_duration_extension_offer} with an improved worth of ${contract.contract_worth_extension_offer} has been declined and the initial contract agreement remains unchanged`
            await this.notificationrepository.save(notification)

            throw new HttpException(declinedMessage,HttpStatus.BAD_REQUEST)
          }
        }

          //response 
          const updatedcontractresponse:IContractModelResponse={
            vendor:contract.vendor,
            model:contract.model,
            contract_duration:contract.contract_duration,
            contract_worth:contract.contract_worth,
            contract_validity_number:contract.contract_validity_number,
            commence_date:contract.commence_date,
            expiration_date:contract.expiration_date,
           };
           return updatedcontractresponse  
      }
          
         catch (error) {
          throw error 
          
        }
        
      }

//pending for now i    
      async terminateContract (contractid:string, vendorid:string,modelid:string,dto:TerminateDto){
        try {
          const contract = await this.contractrepository.findOne({where:{contract_validity_number:contractid}})
          if(!contract) throw new HttpException('the contract is not found',HttpStatus.NOT_FOUND)

          //check if parties are legitmately involved in the contract 
          if (contract.vendor!==vendorid && contract.model!==modelid ) throw new HttpException('you are not authorized to terminate this contract',HttpStatus.UNAUTHORIZED)

          //check if the contract is already terminated
          if(contract.is_terminated) throw new HttpException('contract already terminated',HttpStatus.BAD_REQUEST)

              // Notify the other party about the termination request
          const otherParty = contract.vendor === vendorid ? contract.model : contract.vendor;
          const notificationMessage = `Contract termination request has been sent by ${vendorid}. Reason: ${dto.reason}`;
          await this.sendNotification(otherParty, notificationMessage);

          
        } catch (error) {
          throw error
          
        }
      }

      async acceptTermination(contractid:string,vendorid:string,modelid:string,dto:AcceptContractTermoinationRequestDto){
        try {
           const contract = await this.contractrepository.findOne({where:{contract_validity_number:contractid}})
            if(!contract) throw new HttpException('the contract is not found',HttpStatus.NOT_FOUND)
            const vendor = await this.vendorrepository.findOne({where:{VendorID:vendorid}})
            if (!vendor) throw new HttpException(`you are not a legitimate vendor on this platform and therefore you cannot proceed with this contract termination`,HttpStatus.NOT_FOUND)
            const model = await this.modelrepository.findOne({where:{ModelID:modelid}})
            if (!model) throw new HttpException(`you are not a legitimate model on this platform and therefore you cannot proceed with this contract termination`,HttpStatus.NOT_FOUND)

            //accept for mutual concent 
            if(dto.isAccepted){
              await this.contractrepository.delete(contract)
            }
            


          
        } catch (error) {
          throw error
          
        }
      }



      async sendNotification(recipientId: string, message: string): Promise<void> {
        try {
          // For simplicity, this implementation uses console.log to simulate sending notifications.
          // In a real application, you would implement logic to send notifications through appropriate channels (e.g., emails, push notifications, etc.).
          console.log(`Sending notification to user with ID ${recipientId}: ${message}`);
        } catch (error) {
          // Handle any errors that occur during the notification process
          console.error('Error sending notification:', error.message);
          throw new HttpException('Failed to send notification', HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

}

//contract issue with 