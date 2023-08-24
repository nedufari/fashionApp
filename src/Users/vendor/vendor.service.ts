import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IVendorPostResponse,
  VendorPostsEntity,
} from '../../Entity/Posts/vendor.post.entity';
import {
  CommentsRepository,
  ModelEntityRepository,
  NotificationsRepository,
  PhotographerEntityRepository,
  VendorEntityRepository,
  VendorMakePostRepository,
} from '../../auth/auth.repository';
import { vendorEntity } from '../../Entity/Users/vendor.entity';
import { PhotographerEntity } from '../../Entity/Users/photorapher.entity';
import { ModelEntity } from '../../Entity/Users/model.entity';
import { Notifications } from '../../Entity/Notification/notification.entity';
import {
  AddLinesDto,
  UpdateVendorDataDto,
  VendorMakePostDto,
  VendorUpdatePostDto,
} from './vendor.dto';
import { Contracts } from '../../Entity/contracts.entity';
import {
  ContractOfferRepository,
  ContractRepository,
  CounterContractOfferRepository,
  VendorPostRepository,
} from '../../contract/contrct.repository';
import { Comments } from '../../Entity/Activities/comment.entity';
import { MakeCommentDto } from '../model/model.dto';
import {
  ContractsOfffer,
  IContractOffer,
} from '../../Entity/contractoffer.entity';
import { CounterContractsOfffer } from '../../Entity/countercontractOffer.entity';
import { Availability } from '../../Enums/post.enum';
import { IVendor, IVendorResponse } from './vendor.interface';
import { Niche4Vendors } from '../../Enums/niche.enum';
import { Like, getRepository } from 'typeorm';
import { IModel, IModelResponse } from '../model/model.interface';
import { IPhotographer } from '../photographers/photo.interface';
import { KindOfModel } from '../../Enums/modelType.enum';
import { UploadService } from '../../uploads.service';

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
      where: { PhotographerID: photographerid },
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
      where: { ModelID: modelid },
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
    mediaFiles:Express.Multer.File[]
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
      };

      return customerResponses;
    } catch (error) {
      throw error;
    }
  }

  //update post
  async Updateepost(
    postdto: VendorUpdatePostDto,
    vendorid: string,
    mediaFiles:Express.Multer.File[]
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


      const newpost = new VendorPostsEntity();
      newpost.caption = postdto.caption;
      newpost.media = mediaurls;
      newpost.availability = postdto.availability;
      newpost.cost = postdto.cost;
      newpost.creditedModel = contractModel.model;
      newpost.creditedPhotographer = contractPhotographer.photographer;
      newpost.createdDate = new Date();
      newpost.owner = vendor;
      await this.vendorpostrepository.save(newpost);

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
      };

      return customerResponses;
    } catch (error) {
      throw error;
    }
  }

  async getVendorPosts(vendorId: string): Promise<IVendorPostResponse[]> {
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

      const postResponses: IVendorPostResponse[] = vendorPosts.map((post) => ({
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

      return {
        message: `post with id ${postid} has been deleted by ${vendor.brandname}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async niche(modelid: string, dto: AddLinesDto) {
    const vendor = await this.vendorrepository.findOne({
      where: { VendorID: modelid },
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

  async getAllPosts(): Promise<IVendorPostResponse[]> {
    try {
      const allPosts = await this.vendorpostrepository.find({
        relations: ['owner'], // Load the 'owner' relationship for each post
      });

      const postResponses: IVendorPostResponse[] = allPosts.map((post) => ({
        id: post.id,
        creditedModel: post.creditedModel,
        creditedPhotographer: post.creditedPhotographer,
        media: post.media,
        caption: post.caption,
        cost: post.cost,
        availability: post.availability,
        createdDate: post.createdDate,
        owner: {
          display_photo: post.owner.id,
          brandname: post.owner.brandname,
        },
      }));

      return postResponses;
    } catch (error) {
      throw error;
    }
  }

  //advanced query
  async search(
    keyword: any|string,
  ): Promise<{ models: IModel[]; totalCount: number }> {
    const [models, totalCount] = await this.modelrepository.findAndCount({
      where: [
        { username: Like(`%${keyword}%`) },
        { kindofmodel: KindOfModel.KID},
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
        // Add more columns as needed for your search
      ],
      cache:(false)
    });

    if (totalCount === 0) 
          throw new NotFoundException(
            `No search results found for  "${keyword}"`,)
          
    return { models, totalCount };
  }

    //advanced query for photographers 
    async searchPhotographers(
      keyword: any|string,
    ): Promise<{ photographers: IPhotographer[]; totalCount: number }> {
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
        cache:(false)
      });
  
      if (totalCount === 0) 
            throw new NotFoundException(
              `No search results found for  "${keyword}"`,)
            
      return { photographers, totalCount };
    }

 
}
