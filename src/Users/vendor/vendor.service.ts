import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';
import {
  IVendorPostResponse,
  IvndorPostResponseWithComments,
  VendorPostsEntity,
} from '../../Entity/Posts/vendor.post.entity';
import {
  CommentsRepository,
  ComplaintRepository,
  ModelEntityRepository,
  NotificationsRepository,
  PhotographerEntityRepository,
  VendorEntityRepository,
  VendorMakePostRepository,
  VendorProductRepository,
} from '../../auth/auth.repository';
import { vendorEntity } from '../../Entity/Users/vendor.entity';
import { PhotographerEntity } from '../../Entity/Users/photorapher.entity';
import { ModelEntity } from '../../Entity/Users/model.entity';
import { INotificationResponse, Notifications } from '../../Entity/Notification/notification.entity';
import {
  AddLinesDto,
  UpdateVendorDataDto,
  VendorMakePostDto,
  VendorMakePostandProductDto,
  VendorProductDto,
  VendorUpdatePostDto,
  VendorUpdateProductDto,
} from './vendor.dto';
import { Contracts } from '../../Entity/contracts.entity';
import {ContractOfferRepository,ContractRepository,CounterContractOfferRepository,VendorPostRepository,} from '../../contract/contrct.repository';
import { Comments } from '../../Entity/Activities/comment.entity';
import { MakeCommentDto } from '../model/model.dto';
import {ContractsOfffer,IContractOffer,} from '../../Entity/contractoffer.entity';
import { CounterContractsOfffer } from '../../Entity/countercontractOffer.entity';
import { Availability } from '../../Enums/post.enum';
import { IVendor, IVendorResponse } from './vendor.interface';
import { Niche4Vendors } from '../../Enums/niche.enum';
import { Like, getRepository } from 'typeorm';
import { IModel, IModelResponse } from '../model/model.interface';
import { IPhotographer } from '../photographers/photo.interface';
import { KindOfModel } from '../../Enums/modelType.enum';
import { UploadService } from '../../uploads.service';
import { NotificationType } from '../../Enums/notificationTypes.enum';
import { VendorProducts } from '../../Entity/VendorProducts/vendor.products.entity';
import { ComplaintsEntity } from '../../Entity/Activities/complaints.entity';
import { ComplaintResolutionLevel } from '../../Enums/complaint.enum';
import { LayComplaintDto } from '../../sharedDto/complaints.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(VendorPostsEntity)
    private vendorpostrepository: VendorMakePostRepository,
    @InjectRepository(vendorEntity)
    private vendorrepository: VendorEntityRepository,
    @InjectRepository(PhotographerEntity)
    private photographerrepository: PhotographerEntityRepository,
    @InjectRepository(ModelEntity)
    private modelrepository: ModelEntityRepository,
    @InjectRepository(Notifications)
    private notificationrepository: NotificationsRepository,
    @InjectRepository(Contracts) private contractrepository: ContractRepository,
    @InjectRepository(Comments) private commentrepository: CommentsRepository,
    @InjectRepository(ContractsOfffer)
    private readonly offerripo: ContractOfferRepository,
    @InjectRepository(CounterContractsOfffer)
    private readonly counterripo: CounterContractOfferRepository,
    @InjectRepository(VendorProducts)
    private vendorProductrepository: VendorProductRepository,
    @InjectRepository(ComplaintsEntity)
    private complaintsrepository: ComplaintRepository,
    private readonly fileuploadservice:UploadService
  ) {}

  private async verifyVendor(vendorid: string): Promise<vendorEntity> {
    const vendor = await this.vendorrepository.findOne({
      where: { id: vendorid },
    });
    if (!vendor) {
      throw new HttpException(
        `The vendor is not found or not verified on this platform.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return vendor;
  }

  private async verifyPhotographer(
    photographerid: string,
  ): Promise<PhotographerEntity> {
    const photographer = await this.photographerrepository.findOne({
      where: { id: photographerid },
    });
    if (!photographer) {
      throw new HttpException(
        `The photographer is not found or not verified on this platform.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return photographer;
  }

  private async verifyModel(modelid: string): Promise<ModelEntity> {
    const model = await this.modelrepository.findOne({
      where: { id: modelid },
    });
    if (!model) {
      throw new HttpException(
        `The model is not found or not verified on this platform.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return model;
  }

  private async verifyContract(cvn: string): Promise<Contracts> {
    const contract = await this.contractrepository.findOne({
      where: { contract_validity_number: cvn },
    });
    if (!contract) {
      throw new HttpException(
        `The contract associated with CVN ${cvn} is not found or not valid.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return contract;
  }

  private async verifyPost(postid: number): Promise<VendorPostsEntity> {
    const post = await this.vendorpostrepository.findOne({
      where: { id: postid },
    });
    if (!post) {
      throw new HttpException(`The post is not found.`, HttpStatus.NOT_FOUND);
    }
    return post;
  }

  //make a credited post
  async makepost(
    postdto: VendorMakePostDto,
    vendorid: string,
    mediaFiles:Express.Multer.File[],
  ): Promise<IVendorPostResponse> {
    try {
      const vendor = await this.verifyVendor(vendorid);

     

      const cvnmodel = postdto.cvnmodel;
      const cvnphotographer = postdto.cvnphotographer;

      const contractModel = await this.verifyContract(cvnmodel);
      const contractPhotographer = await this.verifyContract(cvnphotographer);

      const mediaurls :string[] = []

      

     

      for (const file of mediaFiles){
        const mediaurl =await this.fileuploadservice.uploadFile(file)
        mediaurls.push(`http://localhost:3000/api/v1/customer/uploadfile/puplic/${mediaurl}`)
      }

      const newpost =  this.vendorpostrepository.create({
        caption: postdto.caption,
        media: mediaurls,
        availability: postdto.availability,
        cost: postdto.cost,
        creditedModel: contractModel.model,
        creditedPhotographer: contractPhotographer.photographer,
        createdDate: new Date(),
        owner: vendor,
      });

      await this.vendorpostrepository.save(newpost);

      //add Products
      const newProduct = new VendorProducts()
      newProduct.images = mediaurls
      newProduct.price = postdto.cost
      newProduct.post = newpost
      await this.vendorProductrepository.save(newProduct)


      //save the notification
    const notification = new Notifications();
    notification.account = vendor.id;
    notification.subject = 'made a post amd product created!';
    notification.notification_type = NotificationType.vendor_Posted;
    notification.message = `Hello ${vendor.brandname}, just made a post and created a product too for sale ${newProduct.id} `;
    await this.notificationrepository.save(notification);

      const customerResponses: IVendorPostResponse = {
        id: newpost.id,
        creditedModel: newpost.creditedModel,
        creditedPhotographer: newpost.creditedPhotographer,
        media: newpost.media,
        caption: newpost.caption,
        cost: newpost.cost,
        availability: newpost.availability,
        createdDate: newpost.createdDate,
        owner: {
          display_photo: newpost.owner.id,
          brandname: newpost.owner.brandname,
        },
        products:{
          image : newProduct.images,
          price: newProduct.price
        }
        
      };

      return customerResponses;
    } catch (error) {
      throw error;
    }
  }

  //update post
  async Updateepost(
    postdto: VendorUpdatePostDto,
    productdto:VendorUpdateProductDto,
    vendorid: string,
    postid:number,
    productid:number,
    mediaFiles:Express.Multer.File[],
    productfile :Express.Multer.File
  ): Promise<IVendorPostResponse> {
    try {
      const vendor = await this.verifyVendor(vendorid);

      const cvnmodel = postdto.cvnmodel;
      const cvnphotographer = postdto.cvnphotographer;

      const contractModel = await this.verifyContract(cvnmodel);
      const contractPhotographer = await this.verifyContract(cvnphotographer);

      const findpost = await this.vendorpostrepository.findOne({where:{id:postid}})
      if (!findpost) throw new HttpException ('the post with the id does not exist',HttpStatus.NOT_FOUND)

      const findProduct = await this.vendorProductrepository.findOne({where:{id:productid}})
      if (!findProduct) throw new HttpException ('the product with the id does not exist',HttpStatus.NOT_FOUND)

      const mediaurls :string[] = []
      const fileurl = `http://localhost:3000/api/v1/customer/uploadfile/puplic/${productfile}`;
     

      for (const file of mediaFiles){
        const mediaurl =await this.fileuploadservice.uploadFile(file)
        mediaurls.push(`http://localhost:3000/api/v1/customer/uploadfile/puplic/${mediaurl}`)
      }


      ;
      findpost.caption = postdto.caption;
      findpost.media = mediaurls;
      findpost.availability = postdto.availability;
      findpost.cost = postdto.cost;
      findpost.creditedModel = contractModel.model;
      findpost.creditedPhotographer = contractPhotographer.photographer;
      findpost.createdDate = new Date();
      findpost.owner = vendor;
      await this.vendorpostrepository.save(findpost);

      //update the product if need be 
      findProduct.images = mediaurls,
      findProduct.price = productdto.price
      await this.vendorProductrepository.save(findProduct)





         //save the notification
    const notification = new Notifications();
    notification.account = vendor.id;
    notification.subject = 'updated a post!';
    notification.notification_type = NotificationType.vendor_Updated_a_post;
    notification.message = `Hello ${vendor.brandname}, just made an update on a post `;
    await this.notificationrepository.save(notification);

      const customerResponses: IVendorPostResponse = {
        id: findpost.id,
        creditedModel: findpost.creditedModel,
        creditedPhotographer: findpost.creditedPhotographer,
        media: findpost.media,
        caption: findpost.caption,
        cost: findpost.cost,
        availability: findpost.availability,
        createdDate: findpost.createdDate,
        owner: {
          display_photo: findpost.owner.id,
          brandname: findpost.owner.brandname,
        },
        products:{
          image : findProduct.images,
          price: findProduct.price
        }
      };

      return customerResponses;
    } catch (error) {
      throw error;
    }
  }

  async getVendorPosts(vendorId: string): Promise<IvndorPostResponseWithComments[]> {
    try {
      const vendor = await this.vendorrepository.findOne({
        where: { id: vendorId },
      });
      if (!vendor)
        throw new HttpException('Vendor not found', HttpStatus.NOT_FOUND);

      // const vendorPostsRepository = getRepository(VendorPostsEntity);
      const vendorPosts = await this.vendorpostrepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.owner', 'owner')
        .where('owner.id = :vendorId', { vendorId: vendor.id })
        .getMany();

      const postResponses: IvndorPostResponseWithComments[] = vendorPosts.map((post) => ({
        id: post.id,
        creditedModel: post.creditedModel,
        creditedPhotographer: post.creditedPhotographer,
        media: post.media,
        caption: post.caption,
        cost: post.cost,
        availability: post.availability,
        createdDate: post.createdDate,
        likes:post.likes,
        likedBy:post.likedBy,
        owner: {
          display_photo: post.owner.id,
          brandname: post.owner.brandname,
        },
        products: post.products.map((product) => ({
          image: product.images,
          price: product.price,
        })),
      }));

      return postResponses;
    } catch (error) {
      throw error;
    }
  }

  async MakeCommentOnpost(
    dto: MakeCommentDto,
    postid: number,
    vendorid: string,
  ): Promise<{ message: string }> {
    const post = await this.verifyPost(postid);
    const vendor = await this.verifyVendor(vendorid);

    const comment = new Comments();
    (comment.content = dto.comment),
      (comment.vendor = post),
      await this.commentrepository.save(comment);

         //save the notification
    const notification = new Notifications();
    notification.account = vendor.id;
    notification.subject = 'made a post!';
    notification.notification_type = NotificationType.vendor_Posted;
    notification.message = `Hello ${vendor.brandname}, just made a post `;
    await this.notificationrepository.save(notification);

    return { message: 'your comment has been sent ' };
  }

  async getMyoffers(vendor: string): Promise<ContractsOfffer[]> {
    const offersForModel = await this.offerripo.find({
      where: { vendor: vendor },
    });
    if (!offersForModel || offersForModel.length === 0) {
      throw new HttpException(
        'No offers found for the specified vendor',
        HttpStatus.NOT_FOUND,
      );
    }
    return offersForModel;
  }

  async getMyCounteroffers(vendor: string): Promise<CounterContractsOfffer[]> {
    const offersForModel = await this.counterripo.find({
      where: { vendor: vendor },
    });
    if (!offersForModel || offersForModel.length === 0) {
      throw new HttpException(
        'No counter offers found for the specified vendor',
        HttpStatus.NOT_FOUND,
      );
    }
    return offersForModel;
  }

  async getMyNotifications(vendor: string): Promise<INotificationResponse[]> {
    const mynotifications = await this.notificationrepository.find({
      where: { account: vendor },
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

  async UpdateVendor(
    vendorid: string,
    dto: UpdateVendorDataDto,
  ): Promise<IVendorResponse> {
    try {
      const vendor = await this.vendorrepository.findOne({
        where: { VendorID: vendorid },
      });
      if (!vendor) {
        console.log('Vendor not found or verified.');
        throw new HttpException(
          `The vendor is not found or not verified on this platform.`,
          HttpStatus.NOT_FOUND,
        );
      }
      const {
        address,
        phone1,
        phone2,
        bio,
        digital_photo,
        gender,
        facebook,
        tiktok,
        twitter,
        thread,
        instagram,
        snapchat,
      } = dto;

      //update
      vendor.address = address;
      vendor.phone1 = phone1;
      vendor.phone2 = phone2;
      vendor.bio = bio;
      vendor.display_photo = digital_photo;
      vendor.gender = gender;
      vendor.facebook = facebook;
      vendor.tiktok = tiktok;
      vendor.twitter = twitter;
      vendor.thread = thread;
      vendor.instagram = instagram;
      vendor.snapchat = snapchat;

      await this.vendorrepository.save(vendor);

         //save the notification
    const notification = new Notifications();
    notification.account = vendor.id;
    notification.subject = 'update record!';
    notification.notification_type = NotificationType.RECORD_UPDATED;
    notification.message = `Hello ${vendor.brandname}, just made a an update in its records `;
    await this.notificationrepository.save(notification);

      return vendor;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async deleteVendorPost(
    vendorid: string,
    postid: number,
  ): Promise<{ message: string }> {
    try {
      const vendor = await this.verifyVendor(vendorid);

      const post = await this.vendorpostrepository.findOne({
        where: { id: postid },
      });

      if (!post) {
        throw new HttpException(
          'Post not found or you are not the owner',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.vendorpostrepository.remove(post);

         //save the notification
    const notification = new Notifications();
    notification.account = vendor.id;
    notification.subject = 'deleted a post!';
    notification.notification_type = NotificationType.vendor_deleted_a_post;
    notification.message = `Hello ${vendor.brandname}, just deleted a post `;
    await this.notificationrepository.save(notification);

      return {
        message: `post with id ${postid} has been deleted by ${vendor.brandname}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async niche(modelid: string, dto: AddLinesDto) {
    const vendor = await this.vendorrepository.findOne({
      where: { id: modelid },
    });
    if (!vendor)
      throw new HttpException(
        `you are not a legitimate vendor on this platform and therefore you cannot perform this task`,
        HttpStatus.NOT_FOUND,
      );

    vendor.niche = dto.lines;
    await this.vendorrepository.save(vendor);
    return vendor;
  }

  async getAllPosts(): Promise<IvndorPostResponseWithComments[]> {
    try {
      const allPosts = await this.vendorpostrepository.find({
        relations: ['owner','comments','comments.replies','products'], // Load the 'owner' relationship for each post
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

  //advanced query
  async searchModels(
    keyword: any|string,
    page: number = 1, //page number for pagination 
    limit = 20 //number of items per page
  ): Promise<{ models: IModel[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const take = limit;
    const [models, totalCount] = await this.modelrepository.findAndCount({
      where: [
        { username: Like(`%${keyword}%`) },
        { kindofmodel: KindOfModel.KID },
        { kindofmodel: KindOfModel.ADULT },
        { address: Like(`%${keyword}%`) },
        { gender: Like(`%${keyword}%`) },
        { complexion: Like(`%${keyword}%`) },
        { height_in_ft: Like(`%${keyword}%`) },
        { weight_in_kg: Like(`%${keyword}%`) },
        { state_of_residence: Like(`%${keyword}%`) },
        { instagram: Like(`%${keyword}%`) },
        { twitter: Like(`%${keyword}%`) },
        { thread: Like(`%${keyword}%`) },
        { facebook: Like(`%${keyword}%`) },
        { manager: Like(`%${keyword}%`) },
        { bio: Like(`%${keyword}%`) },
      ],
      skip, // Apply pagination - skip records
      take, // Limit the number of records per page
      cache: false,
    });

    if (totalCount === 0) 
          throw new NotFoundException(
            `No search results found for  "${keyword}"`,)
          
    return { models, totalCount };
  }

  



    //advanced query for photographers 
    async searchPhotographers(
      keyword: any|string,
      page: number = 1, //page number for pagination 
      limit = 20 //number of items per page
    ): Promise<{ photographers: IPhotographer[]; totalCount: number }> {
      const skip = (page - 1) * limit;
      const take = limit;
      const [photographers, totalCount] = await this.photographerrepository.findAndCount({
        where: [
          { username: Like(`%${keyword}%`) },
          { address: Like(`%${keyword}%`) },
          { gender: Like(`%${keyword}%`) },
          { state_of_residence: Like(`%${keyword}%`) },
          { instagram: Like(`%${keyword}%`) },
          { twitter: Like(`%${keyword}%`) },
          { thread: Like(`%${keyword}%`) },
          { facebook: Like(`%${keyword}%`) },
          { bio: Like(`%${keyword}%`) },
          // Add more columns as needed for your search
        ],
        skip, // Apply pagination - skip records
        take, // Limit the number of records per page
        cache:(false)
      });
  
      if (totalCount === 0) 
            throw new NotFoundException(
              `No search results found for  "${keyword}"`,)
            
      return { photographers, totalCount };
    }


    async handleComplaint(customerid: string,dto: LayComplaintDto,filename: string,): Promise<{issueID:string, message:string}> {

      try {
        const customer = await this.vendorrepository.findOne({
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
