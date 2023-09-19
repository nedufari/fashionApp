// import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { ComplaintsEntity, IAbuseComplaintResponse, IContractComplaintResponse, IOrderComplaintResponse, IOtherComplaintResponse, IPaymentComplaintResponse, IWalletComplaintResponse } from "../../Entity/Activities/complaints.entity";
// import { ComplaintRepository, CustomerEntityRepository } from "../../auth/auth.repository";
// import { CustomerEntity } from "../../Entity/Users/customer.entity";
// import { ComplaintResolutionLevel, complaintsType } from "../../Enums/complaint.enum";
// import { AbuseComplaintDto, ComplaintDto, ContractComplaintDto, OrderComplaintDto, OtherComplaintDto, PaymentComplaintDto, WalletComplaintDto } from "../../sharedDto/complaints.dto";

// @Injectable()
// export class CustomerComplaintService{
//     constructor ( @InjectRepository(ComplaintsEntity)private complaintsrepository: ComplaintRepository,
//     @InjectRepository(CustomerEntity)private readonly customerripository: CustomerEntityRepository,){}

//     async customerLayComplaint(customerid: string, dto: ComplaintDto) {

//         try {
//           const customer = await this.customerripository.findOne({where: { id: customerid }});
//           if (!customer) {
//             throw new HttpException('The customer is not found', HttpStatus.NOT_FOUND);
//           }
    
//           const complaintType = this.determineComplaintType(dto);
//           console.log("Complaint Type:", complaintType);
//           console.log('log:', dto)

    
//           if (complaintType){
//           switch (complaintType) {
//             case complaintsType.ABUSE:
//               return await this.handleAbuseComplaint(customer, dto.abuseIssue);
    
//             case complaintsType.WALLET_RELATED_ISSUES:
//               return await this.handleWalletComplaint(customer, dto.walletIssue);
    
//             case complaintsType.FAILED_PAYMENT:
//               return await this.handlePaymentComplaint(customer, dto.payment);
    
//             case complaintsType.ORDERS_NOT_RECIEVED:
//               return await this.handleOrderComplaint(customer, dto.orderIssue);
    
//             case complaintsType.VIOLATION_OF_CONTRACT_AGREEMENT:
//               return await this.handleContractComplaint(customer, dto.contractIssue);
    
//             case complaintsType.OTHER_ISSUES:
//               return await this.handleOtherComplaint(customer, dto.otherIssue);
    
//             default:
//               throw new HttpException('amaka', HttpStatus.BAD_REQUEST);
//           }
//         } else {
//             throw new HttpException('ngozi', HttpStatus.BAD_REQUEST);
//           }
//         } catch (error) {
//           throw error;
//         }
//       }



//       private determineComplaintType(dto: ComplaintDto): complaintsType  {
        
//         if (dto.abuseIssue) return complaintsType.ABUSE;
//         if (dto.walletIssue) return complaintsType.WALLET_RELATED_ISSUES;
//         if (dto.payment) return complaintsType.FAILED_PAYMENT;
//         if (dto.orderIssue) return complaintsType.ORDERS_NOT_RECIEVED;
//         if (dto.contractIssue) return complaintsType.VIOLATION_OF_CONTRACT_AGREEMENT;
//         if (dto.otherIssue) return complaintsType.OTHER_ISSUES;
//         return null;
//       }
    
//       // Implement the functions to handle different complaint types
//       private async handleAbuseComplaint(userid: CustomerEntity,dto: AbuseComplaintDto,): Promise<IAbuseComplaintResponse> {

//         try {
//             const newcomplaint = new ComplaintsEntity()
//             newcomplaint.issue = dto.issue
//             newcomplaint.issue_type = dto.complaint_type
//             newcomplaint.pictorial_proof = dto.pictorial_proof
//             newcomplaint.complainerID = userid.id
//             newcomplaint.complainerRole= userid.role
//             newcomplaint.resolution_level = ComplaintResolutionLevel.PROCESSING
//             newcomplaint.reported_at = new Date()
//             await this.complaintsrepository.save(newcomplaint)

//             const response : IAbuseComplaintResponse = {
//                 issueID : newcomplaint.issueID,
//                 issue : newcomplaint.issue,
//                 issue_type : newcomplaint.issue_type,
//                 reported_at : newcomplaint.reported_at,
//                 pictorial_proof : newcomplaint.pictorial_proof,
//                 complainerID : newcomplaint.complainerID,
//                 complainerRole :newcomplaint.complainerRole,
//                 resolution_level : newcomplaint.resolution_level
                
//             }
//             return response

//         } catch (error) {
//             throw error 
            
//         }


//       }
    
//       private async handleWalletComplaint(customer: CustomerEntity,dto: WalletComplaintDto,): Promise<IWalletComplaintResponse> {
//         try {
//             const newcomplaint = new ComplaintsEntity()
//             newcomplaint.issue = dto.issue
//             newcomplaint.issue_type = dto.complaint_type
//             newcomplaint.walletID = dto.walletID
//             newcomplaint.complainerID = customer.id
//             newcomplaint.complainerRole= customer.role
//             newcomplaint.resolution_level = ComplaintResolutionLevel.PROCESSING
//             newcomplaint.reported_at = new Date()
//             await this.complaintsrepository.save(newcomplaint)

//             const response : IWalletComplaintResponse = {
//                 issueID : newcomplaint.issueID,
//                 issue : newcomplaint.issue,
//                 issue_type : newcomplaint.issue_type,
//                 reported_at : newcomplaint.reported_at,
//                 walletID : newcomplaint.walletID,
//                 complainerID : newcomplaint.complainerID,
//                 complainerRole :newcomplaint.complainerRole,
//                 resolution_level : newcomplaint.resolution_level
                
//             }
//             return response
            
//         } catch (error) {
//             throw  error 
            
//         }


        
//       }
    
//       private async handlePaymentComplaint(customer: CustomerEntity,dto: PaymentComplaintDto,): Promise<IPaymentComplaintResponse> {

//         try {
//             const newcomplaint = new ComplaintsEntity()
//             newcomplaint.issue = dto.issue
//             newcomplaint.issue_type = dto.complaint_type
//             newcomplaint.reciept_number = dto.reciept_number
//             newcomplaint.complainerID = customer.id
//             newcomplaint.complainerRole= customer.role
//             newcomplaint.resolution_level = ComplaintResolutionLevel.PROCESSING
//             newcomplaint.reported_at = new Date()
//             await this.complaintsrepository.save(newcomplaint)

//             const response : IPaymentComplaintResponse = {
//                 issueID : newcomplaint.issueID,
//                 issue : newcomplaint.issue,
//                 complaint_type : newcomplaint.issue_type,
//                 reported_at : newcomplaint.reported_at,
//                 reciept_number : newcomplaint.reciept_number,
//                 complainerID : newcomplaint.complainerID,
//                 complainerRole :newcomplaint.complainerRole,
//                 complaint_resolution_level : newcomplaint.resolution_level
                
//             }
//             return response
            
//         } catch (error) {
//             throw error 
            
//         }
//     }
    
//       private async handleOrderComplaint(customer: CustomerEntity,dto: OrderComplaintDto,): Promise<IOrderComplaintResponse> {
//         try {
//             const newcomplaint = new ComplaintsEntity()
//             newcomplaint.issue = dto.issue
//             newcomplaint.issue_type = dto.complaint_type
//             newcomplaint.tracking_number = dto.tracking_number
//             newcomplaint.complainerID = customer.id
//             newcomplaint.complainerRole= customer.role
//             newcomplaint.resolution_level = ComplaintResolutionLevel.PROCESSING
//             newcomplaint.reported_at = new Date()
//             await this.complaintsrepository.save(newcomplaint)

//             const response : IOrderComplaintResponse = {
//                 issueID : newcomplaint.issueID,
//                 issue : newcomplaint.issue,
//                 issue_type : newcomplaint.issue_type,
//                 reported_at : newcomplaint.reported_at,
//                 tracking_number : newcomplaint.tracking_number,
//                 complainerID : newcomplaint.complainerID,
//                 complainerRole :newcomplaint.complainerRole,
//                 resolution_level : newcomplaint.resolution_level
                
//             }
//             return response
            
//         } catch (error) {
//             throw error 
            
//         }
//       }
    
//       private async handleContractComplaint(customer: CustomerEntity,dto: ContractComplaintDto,): Promise<IContractComplaintResponse> {
//         try {
//             const newcomplaint = new ComplaintsEntity()
//             newcomplaint.issue = dto.issue
//             newcomplaint.issue_type = dto.complaint_type
//             newcomplaint.cvn = dto.cvn
//             newcomplaint.complainerID = customer.id
//             newcomplaint.complainerRole= customer.role
//             newcomplaint.resolution_level = ComplaintResolutionLevel.PROCESSING
//             newcomplaint.reported_at = new Date()
//             await this.complaintsrepository.save(newcomplaint)

//             const response : IContractComplaintResponse = {
//                 issueID : newcomplaint.issueID,
//                 issue : newcomplaint.issue,
//                 issue_type : newcomplaint.issue_type,
//                 reported_at : newcomplaint.reported_at,
//                 cvn : newcomplaint.pictorial_proof,
//                 complainerID : newcomplaint.complainerID,
//                 complainerRole :newcomplaint.complainerRole,
//                 resolution_level : newcomplaint.resolution_level
                
//             }
//             return response
            
//         } catch (error) {
//             throw error 
            
//         }
//       }
    
//       private async  handleOtherComplaint(customer: CustomerEntity,dto: OtherComplaintDto, ): Promise<IOtherComplaintResponse> {
//         try {
//             const newcomplaint = new ComplaintsEntity()
//             newcomplaint.issue = dto.issue
//             newcomplaint.issue_type = dto.complaint_type
//             newcomplaint.complainerID = customer.id
//             newcomplaint.complainerRole= customer.role
//             newcomplaint.resolution_level = ComplaintResolutionLevel.PROCESSING
//             newcomplaint.reported_at = new Date()
//             await this.complaintsrepository.save(newcomplaint)

//             const response : IOtherComplaintResponse = {
//                 issueID : newcomplaint.issueID,
//                 issue : newcomplaint.issue,
//                 issue_type : newcomplaint.issue_type,
//                 reported_at : newcomplaint.reported_at,
//                 complainerID : newcomplaint.complainerID,
//                 complainerRole :newcomplaint.complainerRole,
//                 resolution_level : newcomplaint.resolution_level
                
//             }
//             return response
            
//         } catch (error) {
//             throw error
            
//         }
//       }
// }