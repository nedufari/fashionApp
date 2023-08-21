import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ContractOfferRepository, CounterContractOfferRepository, VendorPostRepository } from "../../contract/contrct.repository";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { ModelEntityRepository } from "../../auth/auth.repository";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { AddLinesDto } from "../vendor/vendor.dto";
import { AddInterestsDto } from "./model.dto";
import { IVendorPostResponse, VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";

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


      async niche(modelid:string, dto:AddInterestsDto){
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
    }

    