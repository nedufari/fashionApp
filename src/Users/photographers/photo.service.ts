import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ContractOfferRepository, CounterContractOfferRepository, VendorPostRepository } from "../../contract/contrct.repository";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { ModelEntityRepository, PhotographerEntityRepository, PhotographerTimeLineRepository } from "../../auth/auth.repository";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";
import { IVendorPostResponse, VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";
import { ModelTimelineDto } from "../model/model.dto";
import { UploadService } from "../../uploads.service";
import { IPhotographerTimeLineResponse, PhotographerTimelineEntity } from "../../Entity/Posts/photographer.timeline.entity";
import { UpdatePhotographerDataDto } from "./photo.dto";
import { IPhotographerResponse } from "./photo.interface";
import { PolicyGuards } from "rckg-shared-library";

@Injectable()
export class PhotographerService{
    constructor(@InjectRepository(ContractsOfffer) private readonly offerripo:ContractOfferRepository,
    @InjectRepository(PhotographerEntity) private readonly photoripo:PhotographerEntityRepository,
    @InjectRepository(CounterContractsOfffer) private readonly counterripo:CounterContractOfferRepository,
    @InjectRepository(VendorPostsEntity)private readonly vendorpostripo:VendorPostRepository,
    private readonly fileuploadservice:UploadService,
    @InjectRepository(PhotographerTimelineEntity)
    private readonly phototimelineripo: PhotographerTimeLineRepository,){}

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

      async getAllPosts(): Promise<IVendorPostResponse[]> {
        try {
          const allPosts = await this.vendorpostripo.find({
            relations: ['owner'], // Load the 'owner' relationship for each post
          });
      
          const postResponses: IVendorPostResponse[] = allPosts.map(post => ({
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


  //create timeline 
  async createAtimeline(dto:ModelTimelineDto,modelid:string,mediaFiles:Express.Multer.File[]):Promise<IPhotographerTimeLineResponse>{
    try {
      const model = await this.photoripo.findOne({ where: { PhotographerID: modelid } });
      if (!model) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)
  
  
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
          owner : model
        })
        await this.phototimelineripo.save(newpost)
  
        const timelineresponse : IPhotographerTimeLineResponse = {
          id:newpost.id,
          media : newpost.media,
          caption : newpost.caption,
          createdDate : newpost.createdDate,
          owner :{
            displayPicture : newpost.owner.displayPicture,
            username : newpost.owner.username
          }
        }
        return timelineresponse
      
    } catch (error) {
      throw error  
    }
  }


  async UpdateAtimeline(dto:ModelTimelineDto,timelineid:number,modelid:string,mediaFiles:Express.Multer.File[]):Promise<IPhotographerTimeLineResponse>{
    try {
      const model = await this.photoripo.findOne({ where: { PhotographerID: modelid } });
      if (!model) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)

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
          findtimeline.owner = model
        
        await this.phototimelineripo.save(findtimeline)
  
        const timelineresponse : IPhotographerTimeLineResponse = {
          id:findtimeline.id,
          media : findtimeline.media,
          caption : findtimeline.caption,
          createdDate : findtimeline.createdDate,
          owner :{
            displayPicture : findtimeline.owner.displayPicture,
            username : findtimeline.owner.username
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
      
      const model = await this.photoripo.findOne({ where: { id: photoid } });
      if (!model) throw new HttpException('model with the id not found',HttpStatus.NOT_FOUND)

      const findtimeline = await this.phototimelineripo.findOne({where:{id:timelineid}})
      if (!findtimeline) throw new HttpException ('the post with the id does not exist',HttpStatus.NOT_FOUND)

      //remov the post 
      await this.phototimelineripo.remove(findtimeline)
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
    photographer.username = dto.username
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

    const photgrapherresponse :IPhotographerResponse = {
      username : photographer.username,
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

  


    }