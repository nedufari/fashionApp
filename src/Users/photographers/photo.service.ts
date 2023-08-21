import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ContractOfferRepository, CounterContractOfferRepository, VendorPostRepository } from "../../contract/contrct.repository";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { ModelEntityRepository, PhotographerEntityRepository } from "../../auth/auth.repository";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";
import { IVendorPostResponse, VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";

@Injectable()
export class PhotographerService{
    constructor(@InjectRepository(ContractsOfffer) private readonly offerripo:ContractOfferRepository,
    @InjectRepository(PhotographerEntity) private readonly photoripo:PhotographerEntityRepository,
    @InjectRepository(CounterContractsOfffer) private readonly counterripo:CounterContractOfferRepository,
    @InjectRepository(VendorPostsEntity)private readonly vendorpostripo:VendorPostRepository,){}

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
    }