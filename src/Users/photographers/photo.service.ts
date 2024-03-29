import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ContractOfferRepository, CounterContractOfferRepository, VendorPostRepository } from "../../contract/contrct.repository";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { ComplaintRepository, ModelEntityRepository, NotificationsRepository, PhotographerEntityRepository, PhotographerTimeLineRepository } from "../../auth/auth.repository";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";
import { IVendorPostResponse, IvndorPostResponseWithComments, VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";
import { ModelTimelineDto } from "../model/model.dto";
import { UploadService } from "../../uploads.service";
import { IPhotographerTimeLineResponse, PhotographerTimelineEntity } from "../../Entity/Posts/photographer.timeline.entity";
import { UpdatePhotographerDataDto } from "./photo.dto";
import { IPhotographerResponse } from "./photo.interface";
import { PolicyGuards } from "rckg-shared-library";
import { INotificationResponse, Notifications } from "../../Entity/Notification/notification.entity";
import { NotificationType } from "../../Enums/notificationTypes.enum";
import { ComplaintsEntity } from "../../Entity/Activities/complaints.entity";
import { ComplaintResolutionLevel } from "../../Enums/complaint.enum";
import { LayComplaintDto } from "../../sharedDto/complaints.dto";

@Injectable()
export class PhotographerService{
    constructor(@InjectRepository(ContractsOfffer) private readonly offerripo:ContractOfferRepository,
    @InjectRepository(PhotographerEntity) private readonly photoripo:PhotographerEntityRepository,
    @InjectRepository(CounterContractsOfffer) private readonly counterripo:CounterContractOfferRepository,
    @InjectRepository(VendorPostsEntity)private readonly vendorpostripo:VendorPostRepository,
    private readonly fileuploadservice:UploadService,
    @InjectRepository(Notifications)private notificationrepository:NotificationsRepository,
    @InjectRepository(PhotographerTimelineEntity)
    private readonly phototimelineripo: PhotographerTimeLineRepository,
    @InjectRepository(ComplaintsEntity)
    private complaintsrepository: ComplaintRepository,){}

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

      async getAllPosts(): Promise<IvndorPostResponseWithComments[]> {
        try {
          const allPosts = await this.vendorpostripo.find({
            relations: ['owner'], // Load the 'owner' relationship for each post
          });
      
          const postResponses: IvndorPostResponseWithComments[] = allPosts.map((post) => ({
            id: post.id,
            creditedModel: post.creditedModel,
            creditedPhotographer: post.creditedPhotographer,
            media: post.media,
            caption: post.caption,
            cost: post.cost,
            availability: post.availability,
            createdDate: post.createdDate,
            likes: post.likes,
            likedBy: post.likedBy,
            owner: {
              display_photo: post.owner.id,
              brandname: post.owner.brandname,
            },
    
            products: post.products.map((product) => ({
              image: product.images,
              price: product.price,
            })),
    
            comments: post.comments.map((comment) => ({
              id: comment.id,
              content: comment.content,
              replies: comment.replies.map((reply) => ({
                id: reply.id,
                reply: reply.reply,
              })),
            })),
    
            
          }));
    
      
          return postResponses;
        } catch (error) {
          throw error;
        }
      }

      async getMyNotifications(photographer: string): Promise<INotificationResponse[]> {
        const mynotifications = await this.notificationrepository.find({
          where: { account: photographer },
        });
        if (!mynotifications || mynotifications.length === 0) {
          throw new HttpException(
            'No notifications found',
            HttpStatus.NOT_FOUND,
          );
        }
        const notificationResponse :INotificationResponse[] = mynotifications.map((notifcation)=>({
          message: notifcation.message,
          notification_type: notifcation.notification_type,
          subject:notifcation.subject,
          date : notifcation.date
        }))
          
        
        return notificationResponse;
      }


  //create timeline 
  async createAtimeline(dto:ModelTimelineDto,modelid:string,mediaFiles:Express.Multer.File[]):Promise<IPhotographerTimeLineResponse>{
    try {
      const photographer = await this.photoripo.findOne({ where: { id: modelid } });
      if (!photographer) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)
  
  
      const mediaurls :string[] = []
       
  
        for (const file of mediaFiles){
          const mediaurl =await this.fileuploadservice.uploadFile(file)
          mediaurls.push(`http://localhost:3000/api/v1/customer/uploadfile/puplic/${mediaurl}`)
        }
  
        //create a post 
        const newpost = await this.phototimelineripo.create({
          caption : dto.caption,
          media : mediaurls,
          createdDate : new Date(),
          owner : photographer
        })
        await this.phototimelineripo.save(newpost)

        //save the notification
    const notification = new Notifications();
    notification.account = photographer.id;
    notification.subject = 'made a post!';
    notification.notification_type = NotificationType.photographer_Posted;
    notification.message = `Hello ${photographer.brandname}, just made a post `;
    await this.notificationrepository.save(notification);
  
        const timelineresponse : IPhotographerTimeLineResponse = {
          id:newpost.id,
          media : newpost.media,
          caption : newpost.caption,
          createdDate : newpost.createdDate,
          owner :{
            displayPicture : newpost.owner.displayPicture,
            brandname : newpost.owner.brandname
          }
        }
        return timelineresponse
      
    } catch (error) {
      throw error  
    }
  }


  async UpdateAtimeline(dto:ModelTimelineDto,timelineid:number,modelid:string,mediaFiles:Express.Multer.File[]):Promise<IPhotographerTimeLineResponse>{
    try {
      const photographer = await this.photoripo.findOne({ where: { id: modelid } });
      if (!photographer) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)

      const findtimeline = await this.phototimelineripo.findOne({where:{id:timelineid}})
      if (!findtimeline) throw new HttpException ('the post with the id does not exist',HttpStatus.NOT_FOUND)
  
  
      const mediaurls :string[] = []
       
  
        for (const file of mediaFiles){
          const mediaurl =await this.fileuploadservice.uploadFile(file)
          mediaurls.push(`http://localhost:3000/api/v1/customer/uploadfile/puplic/${mediaurl}`)
        }
  
        //create a post 
        
          findtimeline.caption = dto.caption,
          findtimeline.media = mediaurls,
          findtimeline.createdDate = new Date(),
          findtimeline.owner = photographer
        
        await this.phototimelineripo.save(findtimeline)

        //save the notification
    const notification = new Notifications();
    notification.account = photographer.id;
    notification.subject = 'Updated a post!';
    notification.notification_type = NotificationType.photographer_Updated_a_post;
    notification.message = `Hello ${photographer.brandname}, just updated a post `;
    await this.notificationrepository.save(notification);
  
        const timelineresponse : IPhotographerTimeLineResponse = {
          id:findtimeline.id,
          media : findtimeline.media,
          caption : findtimeline.caption,
          createdDate : findtimeline.createdDate,
          owner :{
            displayPicture : findtimeline.owner.displayPicture,
            brandname : findtimeline.owner.brandname
          }
        }
        return timelineresponse
      
    } catch (error) {
      throw error  
    }
  }


  async  mytimeLines(modelid:string):Promise<IPhotographerTimeLineResponse[]>{
    try {
      const model = await this.photoripo.findOne({ where: { id: modelid } });
      if (!model) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)

      const modeltimeline = await this.phototimelineripo
      .createQueryBuilder('timeline')
      .leftJoinAndSelect('timeline.owner','owner')
      .where('owner.id = :modelid',{modelid:model.id})
      .getMany()

      const timelineresponses:IPhotographerTimeLineResponse[] = modeltimeline.map((timeline)=>({
        id:timeline.id,
        media:timeline.media,
        caption :timeline.caption,
        likes:timeline.likes,
        dislikes:timeline.dislikes,
        createdDate :timeline.createdDate,
        owner:{
          displayPicture:timeline.owner.displayPicture,
          brandname :timeline.owner.brandname
        }
      }))
      return timelineresponses

      
      
    } catch (error) {
      throw error
      
    }
  }

  async TakedownTimeline(photoid:string,timelineid:number):Promise<{message:string}>{
    try {
      
      const photographer = await this.photoripo.findOne({ where: { id: photoid } });
      if (!photographer) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)

      const findtimeline = await this.phototimelineripo.findOne({where:{id:timelineid}})
      if (!findtimeline) throw new HttpException ('the post with the id does not exist',HttpStatus.NOT_FOUND)

      //remov the post 
      await this.phototimelineripo.remove(findtimeline)

      //save the notification
    const notification = new Notifications();
    notification.account = photographer.id;
    notification.subject = 'deleted a post!';
    notification.notification_type = NotificationType.photographer_deleted_a_post;
    notification.message = `Hello ${photographer.brandname}, just deleted a post `;
    await this.notificationrepository.save(notification);

      return {message:'timeline has been removed successfully'}
  
    } catch (error) {
      throw error 
    }
  }

  //create  the photographer portfolio

  async createPhotographerportfolio(photoid:string,dto:UpdatePhotographerDataDto):Promise<IPhotographerResponse>{
    const photographer = await this.photoripo.findOne({ where: { id: photoid } });
    if (!photographer) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)

    //update the userdaa 
    photographer.brandname = dto.brandname
    photographer.fullname = dto.fullname
    photographer.address = dto.address
    photographer.phone1 = dto.phone1
    photographer.phone2 = dto.phone2
    photographer.bio = dto.bio
    photographer.age = dto.age
    photographer.gender = dto.gender
    photographer.facebook = dto.facebook
    photographer.twitter = dto.twitter
    photographer.thread = dto.thread
    photographer.tiktok = dto.tiktok
    photographer.snapchat =dto.snapchat
    photographer.pricerange = dto.pricerange
    photographer.negotiable = dto.negotiable,
    photographer.paymentplan = dto.paymentplan

    await this.photoripo.save(photographer)

    //save the notification
    const notification = new Notifications();
    notification.account = photographer.id;
    notification.subject = 'Updated portfolio!';
    notification.notification_type = NotificationType.RECORD_UPDATED;
    notification.message = `Hello ${photographer.brandname}, just updated its portfolio `;
    await this.notificationrepository.save(notification);

    const photgrapherresponse :IPhotographerResponse = {
      brandname : photographer.brandname,
      fullname : photographer.fullname,
      address : photographer.address,
      phone1 :photographer.phone1,
      phone2 :photographer.phone2,
      bio :photographer.bio,
      age: photographer.age,
      gender : photographer.gender,
      facebook : photographer.facebook,
      twitter :photographer.twitter,
      thread :photographer.thread,
      tiktok : photographer.tiktok,
      snapchat: photographer.snapchat,
      pricerange :photographer.pricerange,
      negotiable :photographer.negotiable,
      paymentplan : photographer.paymentplan,
      instagram : photographer.instagram,
      displayPicture : photographer.displayPicture,
      PhotographerID : photographer.PhotographerID
      
      
    }
    return photgrapherresponse

  }

  async updateProfilePics(
    filename: string,
    customerid: string,
  ): Promise<{ message: string }> {
    try {
      const photographer = await this.photoripo.findOne({
        where: { id: customerid },
      });
      if (!photographer) {
        throw new HttpException(
          'The customer is not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const fileurl = `http://localhost:3000/api/v1/customer/uploadfile/puplic/${filename}`;

      //update picture
      photographer.displayPicture = fileurl;
      await this.photoripo.save(photographer);

      //save the notification
      const notification = new Notifications();
      notification.account = photographer.id;
      notification.subject = 'uploaded a profile picture!';
      notification.notification_type =
        NotificationType.customer_Uploaded_a_profilePicture;
      notification.message = `Hello ${photographer.brandname}, just uploaded a profile picture `;
      await this.notificationrepository.save(notification);

      return { message: photographer.displayPicture };
    } catch (error) {
      throw error
    }
  }

  async handleComplaint(customerid: string,dto: LayComplaintDto,filename: string,): Promise<{issueID:string, message:string}> {

    try {
      const customer = await this.photoripo.findOne({
        where: { id: customerid },
      });
      if (!customer) {
        throw new HttpException(
          'The customer is not found',
          HttpStatus.NOT_FOUND,
        );
      }

        const fileurl = `http://localhost:3000/api/v1/customer/uploadfile/puplic/${filename}`;


        const newcomplaint = new ComplaintsEntity()
        newcomplaint.issue = dto.issue
        newcomplaint.issue_type = dto.complaint_type
        newcomplaint.pictorial_proof = fileurl
        newcomplaint.walletID = dto.walletID
        newcomplaint.tracking_number = dto.tracking_number
        newcomplaint.cvn = dto.cvn
        newcomplaint.reciept_number =dto.reciept_number
        newcomplaint.complainerID = customer.id
        newcomplaint.complainerRole= customer.role
        newcomplaint.resolution_level = ComplaintResolutionLevel.PROCESSING
        newcomplaint.reported_at = new Date()
        await this.complaintsrepository.save(newcomplaint)

        const responseIssueID = `${newcomplaint.issueID}`
       const responseMessage = `Your complaint has been Fowarded to the Walkway Review Team. This ID displayed above is the issueID, copy and save. You can use it to track the resolution level of your complaint few days from today. Thank you for chosing Walkway.`
      
       return {issueID:responseIssueID, message:responseMessage}

    } catch (error) {
        throw error 
        
    }

  }


    }