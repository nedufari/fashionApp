import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractsOfffer } from '../../Entity/contractoffer.entity';
import {
  ContractOfferRepository,
  CounterContractOfferRepository,
  VendorPostRepository,
} from '../../contract/contrct.repository';
import { ModelEntity } from '../../Entity/Users/model.entity';
import { ModelEntityRepository, ModelTimeLineRepository } from '../../auth/auth.repository';
import { CounterContractsOfffer } from '../../Entity/countercontractOffer.entity';
import { AddLinesDto } from '../vendor/vendor.dto';
import { AddInterestsDto, ModelPortfolioDto, ModelTimelineDto } from './model.dto';
import {
  IVendorPostResponse,
  VendorPostsEntity,
} from '../../Entity/Posts/vendor.post.entity';
import { IModelResponse } from './model.interface';
import { loggers } from 'winston';
import { IModelTimeLineResponse, ModelTimelineEntity } from '../../Entity/Posts/model.timeline.entity';
import { UploadService } from '../../uploads.service';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(ContractsOfffer)
    private readonly offerripo: ContractOfferRepository,
    @InjectRepository(ModelEntity)
    private readonly modelripo: ModelEntityRepository,
    @InjectRepository(CounterContractsOfffer)
    private readonly counterripo: CounterContractOfferRepository,
    @InjectRepository(VendorPostsEntity)
    private readonly vendorpostripo: VendorPostRepository,
    @InjectRepository(ModelTimelineEntity)
    private readonly modeltimelineripo: ModelTimeLineRepository,
    private readonly fileuploadservice:UploadService
  ) {}

  async getMyoffers(model: string): Promise<ContractsOfffer[]> {
    const offersForModel = await this.offerripo.find({
      where: { model: model },
    });
    if (!offersForModel || offersForModel.length === 0) {
      throw new HttpException(
        'No offers found for the specified model',
        HttpStatus.NOT_FOUND,
      );
    }
    return offersForModel;
  }

  async getMyCounteroffers(model: string): Promise<CounterContractsOfffer[]> {
    const offersForModel = await this.counterripo.find({
      where: { model: model },
    });
    if (!offersForModel || offersForModel.length === 0) {
      throw new HttpException(
        'No offers found for the specified model',
        HttpStatus.NOT_FOUND,
      );
    }
    return offersForModel;
  }

  async AddInterests(modelid: string, dto: AddInterestsDto) {
    const model = await this.modelripo.findOne({ where: { ModelID: modelid } });
    if (!model)
      throw new HttpException(
        `you are not a legitimate model on this platform and therefore you cannot perform this task`,
        HttpStatus.NOT_FOUND,
      );

    model.interests = dto.interests;
    await this.modelripo.save(model);
    return model;
  }

  async getAllPosts(): Promise<IVendorPostResponse[]> {
    try {
      const allPosts = await this.vendorpostripo.find({
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

  async createPortfolio(
    modelid: string,
    dto: ModelPortfolioDto,
  ): Promise<IModelResponse> {
    const model = await this.modelripo.findOne({ where: { ModelID: modelid } });
    if (!model)
      throw new HttpException(
        `you are not a legitimate model on this platform and therefore you cannot perform this task`,
        HttpStatus.NOT_FOUND,
      );

    (model.username = dto.username),
      (model.address = dto.address),
      (model.phone1 = dto.phone1),
      (model.phone2 = dto.phone2),
      (model.bio = dto.bio),
      (model.age = dto.age),
      (model.gender = dto.gender),
      (model.on_low_cut = dto.on_low_cut),
      (model.height_in_ft = dto.height_in_ft),
      (model.weight_in_kg = dto.weight_in_kg),
      (model.state_of_residence = dto.state_of_residence),
      (model.facebook = dto.facebook),
      (model.twitter = dto.twitter),
      (model.thread = dto.thread),
      (model.instagram = dto.instagram),
      (model.tiktok = dto.tiktok),
      (model.snapchat = dto.snapchat),
      (model.gown_length = dto.gown_length),
      (model.gown_size = dto.gown_size),
      (model.blouse_size = dto.blouse_size),
      (model.blouse_length = dto.blouse_length),
      (model.skirt_length = dto.skirt_length),
      (model.skirt_size = dto.skirt_size),
      (model.hat_size = dto.hat_size),
      (model.shoulder = dto.shoulder),
      (model.burst = dto.burst),
      (model.burst_point = dto.burst_point),
      (model.round_under_burst = dto.round_under_burst),
      (model.under_burst_length = dto.under_burst_length),
      (model.nipple_to_nipple = dto.nipple_to_nipple),
      (model.half_length = dto.half_length),
      (model.arm_hole = dto.arm_hole),
      (model.sleve_long = dto.sleve_long),
      (model.sleve_3qtr = dto.sleve_3qtr),
      (model.sleve_short = dto.sleve_short),
      (model.Round_sleeve = dto.Round_sleeve),
      (model.elbow = dto.elbow),
      (model.heep = dto.heep),
      (model.heep_length = dto.heep_length),
      (model.flap = dto.flap),
      (model.waist = dto.waist),
      (model.knee_length = dto.knee_length),
      (model.ankle = dto.ankle),
      (model.thigh = dto.thigh),
      (model.wrist = dto.wrist),
      (model.chest = dto.chest),
      (model.shirt_length = dto.shirt_length),
      (model.shirt_size = dto.shirt_size),
      (model.top_length = dto.top_length),
      (model.back = dto.back),
      (model.caps_ize = dto.caps_ize),
      (model.shoe_size = dto.shoe_size),
      (model.alternative_shoe_size = dto.alternative_shoe_size),
      (model.pricerange = dto.pricerange),
      (model.negotiable = dto.negotiable),
      (model.paymentplan = dto.paymentplan),
      (model.cratedDate = new Date()),
      await this.modelripo.save(model);

    return model;
  }


  //create timeline 
  async createAtimeline(dto:ModelTimelineDto,modelid:string,mediaFiles:Express.Multer.File[]):Promise<IModelTimeLineResponse>{
    try {
      const model = await this.modelripo.findOne({ where: { ModelID: modelid } });
      if (!model) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)
  
  
      const mediaurls :string[] = []
       
  
        for (const file of mediaFiles){
          const mediaurl =await this.fileuploadservice.uploadFile(file)
          mediaurls.push(`http://localhost:3000/api/v1/customer/uploadfile/puplic/${mediaurl}`)
        }
  
        //create a post 
        const newpost = await this.modeltimelineripo.create({
          caption : dto.caption,
          media : mediaurls,
          createdDate : new Date(),
          owner : model
        })
        await this.modeltimelineripo.save(newpost)
  
        const timelineresponse : IModelTimeLineResponse = {
          id:newpost.id,
          media : newpost.media,
          caption : newpost.caption,
          createdDate : newpost.createdDate,
          owner :{
            digital_photo : newpost.owner.digital_photo,
            username : newpost.owner.username
          }
        }
        return timelineresponse
      
    } catch (error) {
      throw error  
    }
  }


  async UpdateAtimeline(dto:ModelTimelineDto,timelineid:number,modelid:string,mediaFiles:Express.Multer.File[]):Promise<IModelTimeLineResponse>{
    try {
      const model = await this.modelripo.findOne({ where: { ModelID: modelid } });
      if (!model) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)

      const findtimeline = await this.modeltimelineripo.findOne({where:{id:timelineid}})
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
          findtimeline.owner = model
        
        await this.modeltimelineripo.save(findtimeline)
  
        const timelineresponse : IModelTimeLineResponse = {
          id:findtimeline.id,
          media : findtimeline.media,
          caption : findtimeline.caption,
          createdDate : findtimeline.createdDate,
          owner :{
            digital_photo : findtimeline.owner.digital_photo,
            username : findtimeline.owner.username
          }
        }
        return timelineresponse
      
    } catch (error) {
      throw error  
    }
  }


  async  mytimeLines(modelid:string):Promise<IModelTimeLineResponse[]>{
    try {
      const model = await this.modelripo.findOne({ where: { id: modelid } });
      if (!model) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)

      const modeltimeline = await this.modeltimelineripo
      .createQueryBuilder('timeline')
      .leftJoinAndSelect('timeline.owner','owner')
      .where('owner.id = :modelid',{modelid:model.id})
      .getMany()

      const timelineresponses:IModelTimeLineResponse[] = modeltimeline.map((timeline)=>({
        id:timeline.id,
        media:timeline.media,
        caption :timeline.caption,
        likes:timeline.likes,
        dislikes:timeline.dislikes,
        createdDate :timeline.createdDate,
        owner:{
          digital_photo:timeline.owner.digital_photo,
          username :timeline.owner.username
        }
      }))
      return timelineresponses

      
      
    } catch (error) {
      throw error
      
    }
  }

  async TakedownTimeline(photoid:string,timelineid:number):Promise<{message:string}>{
    try {
      
      const model = await this.modelripo.findOne({ where: { id: photoid } });
      if (!model) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)

      const findtimeline = await this.modeltimelineripo.findOne({where:{id:timelineid}})
      if (!findtimeline) throw new HttpException ('the post with the id does not exist',HttpStatus.NOT_FOUND)

      //remov the post 
      await this.modeltimelineripo.remove(findtimeline)
      return {message:'timeline has been removed successfully'}
  
    } catch (error) {
      throw error 
      
    }

  }


  
}
