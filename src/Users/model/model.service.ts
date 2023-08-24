import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ContractOfferRepository, CounterContractOfferRepository, VendorPostRepository } from "../../contract/contrct.repository";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { ModelEntityRepository } from "../../auth/auth.repository";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { AddLinesDto } from "../vendor/vendor.dto";
import { AddInterestsDto, ModelPortfolioDto } from "./model.dto";
import { IVendorPostResponse, VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";
import { IModelResponse } from "./model.interface";
import { loggers } from "winston";

@Injectable()
export class ModelService{
    constructor(@InjectRepository(ContractsOfffer) private readonly offerripo:ContractOfferRepository,
    @InjectRepository(ModelEntity) private readonly modelripo:ModelEntityRepository,
    @InjectRepository(CounterContractsOfffer) private readonly counterripo:CounterContractOfferRepository,
    @InjectRepository(VendorPostsEntity)private readonly vendorpostripo:VendorPostRepository,){}

    async getMyoffers(model: string): Promise<ContractsOfffer[]> {
        const offersForModel = await this.offerripo.find({ where: { model: model } });
        if (!offersForModel || offersForModel.length === 0) {
          throw new HttpException('No offers found for the specified model', HttpStatus.NOT_FOUND);
        }
        return offersForModel;
      }
    

    async getMyCounteroffers(model: string): Promise<CounterContractsOfffer[]> {
        const offersForModel = await this.counterripo.find({ where: { model: model } });
        if (!offersForModel || offersForModel.length === 0) {
          throw new HttpException('No offers found for the specified model', HttpStatus.NOT_FOUND);
        }
        return offersForModel;
      }


      async AddInterests(modelid:string, dto:AddInterestsDto){
        const model = await this.modelripo.findOne({ where: { ModelID: modelid } });
        if (!model) throw new HttpException(`you are not a legitimate model on this platform and therefore you cannot perform this task`, HttpStatus.NOT_FOUND);

        model.interests = dto.interests
        await this.modelripo.save(model)
        return model

      
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

      async createPortfolio(modelid:string,dto:ModelPortfolioDto):Promise<IModelResponse>{
        const model = await this.modelripo.findOne({ where: { ModelID: modelid } });
        if (!model) throw new HttpException(`you are not a legitimate model on this platform and therefore you cannot perform this task`, HttpStatus.NOT_FOUND);


        const data = await this.modelripo.create({
          username : dto.username,
          address:dto.address,
          phone1:dto.phone1,
          phone2:dto.phone2,
          bio:dto.bio,
          age:dto.age,
          gender :dto.gender,
          on_low_cut:dto.on_low_cut,
          height_in_ft:dto.height_in_ft,
          weight_in_kg :dto.weight_in_kg,
          state_of_residence: dto.state_of_residence,
          facebook:dto.facebook,
          twitter:dto.twitter,
          thread :dto.thread,
          instagram:dto.instagram,
          tiktok:dto.tiktok,
          snapchat:dto.snapchat,
          gown_length:dto.gown_length,
          gown_size :dto.gown_size,
          blouse_size:dto.blouse_size,
          blouse_length:dto.blouse_length,
          skirt_length:dto.skirt_length,
          skirt_size:dto.skirt_size,
          hat_size:dto.hat_size,
          shoulder:dto.shoulder,
          burst:dto.burst,
          burst_point:dto.burst_point,
          round_under_burst:dto.round_under_burst,
          under_burst_length:dto.under_burst_length,
          nipple_to_nipple:dto.nipple_to_nipple,
          half_length:dto.half_length,
          arm_hole:dto.arm_hole,
          sleve_long:dto.sleve_long,
          sleve_3qtr:dto.sleve_3qtr,
          sleve_short:dto.sleve_short,
          Round_sleeve:dto.Round_sleeve,
          elbow:dto.elbow,
          heep:dto.heep,
          heep_length:dto.heep_length,
          flap:dto.flap,
          waist:dto.waist,
         knee_length:dto.knee_length,
         ankle:dto.ankle,
         thigh:dto.thigh,
         wrist:dto.wrist,
         chest:dto.chest,
         shirt_length:dto.shirt_length,
         shirt_size:dto.shirt_size,
         top_length:dto.top_length,
         back:dto.back,
         caps_ize:dto.caps_ize,
         shoe_size:dto.shoe_size,
         alternative_shoe_size:dto.alternative_shoe_size,
         pricerange:dto.pricerange,
         negotiable:dto.negotiable,
         paymentplan:dto.paymentplan,
         cratedDate :new Date(),
         
         
        })
        await this.modelripo.save(data)
        
        return data

      }
    }

    