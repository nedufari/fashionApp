import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IVendorPostResponse, VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";
import { CommentsRepository, ModelEntityRepository, NotificationsRepository, PhotographerEntityRepository, VendorEntityRepository, VendorMakePostRepository } from "../../auth/auth.repository";
import { vendorEntity } from "../../Entity/Users/vendor.entity";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { Notifications } from "../../Entity/Notification/notification.entity";
import { VendorMakePostDto } from "./vendor.dto";
import { Contracts } from "../../Entity/contracts.entity";
import { ContractOfferRepository, ContractRepository, CounterContractOfferRepository, VendorPostRepository } from "../../contract/contrct.repository";
import { Comments } from "../../Entity/Activities/comment.entity";
import { MakeCommentDto } from "../model/model.dto";
import { ContractsOfffer, IContractOffer } from "../../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { Availability } from "../../Enums/post.enum";

@Injectable()
export class VendorService{
    constructor(@InjectRepository(VendorPostsEntity)private vendorpostrepository:VendorMakePostRepository,
    @InjectRepository(vendorEntity)private vendorrepository:VendorEntityRepository,
    @InjectRepository(PhotographerEntity)private photographerrepository:PhotographerEntityRepository,
    @InjectRepository(ModelEntity)private modelrepository:ModelEntityRepository,
    @InjectRepository(Notifications)private notificationrepository:NotificationsRepository,
    @InjectRepository(Contracts)private contractrepository:ContractRepository,
    @InjectRepository(Comments)private commentrepository:CommentsRepository,
    @InjectRepository(ContractsOfffer) private readonly offerripo:ContractOfferRepository,
    @InjectRepository(CounterContractsOfffer) private readonly counterripo:CounterContractOfferRepository,
   
    
){}


private async verifyVendor(vendorid: string): Promise<vendorEntity> {
    const vendor = await this.vendorrepository.findOne({ where: { VendorID: vendorid } });
    if (!vendor) {
        throw new HttpException(`The vendor is not found or not verified on this platform.`, HttpStatus.NOT_FOUND);
    }
    return vendor;
}

private async verifyPhotographer(photographerid: string): Promise<PhotographerEntity> {
    const photographer = await this.photographerrepository.findOne({ where: { PhotographerID: photographerid } });
    if (!photographer) {
        throw new HttpException(`The photographer is not found or not verified on this platform.`, HttpStatus.NOT_FOUND);
    }
    return photographer;
}

private async verifyModel(modelid: string): Promise<ModelEntity> {
    const model = await this.modelrepository.findOne({ where: { ModelID: modelid} });
    if (!model) {
        throw new HttpException(`The model is not found or not verified on this platform.`, HttpStatus.NOT_FOUND);
    }
    return model;
}

private async verifyContract(cvn: string): Promise<Contracts> {
    const contract = await this.contractrepository.findOne({ where: { contract_validity_number: cvn} });
    if (!contract) {
        throw new HttpException(`The contract associated with CVN ${cvn} is not found or not valid.`, HttpStatus.NOT_FOUND);
    }
    return contract;
}

private async verifyPost(postid: number): Promise<VendorPostsEntity> {
    const post = await this.vendorpostrepository.findOne({ where: {id:postid }});
    if (!post) {
        throw new HttpException(`The post is not found.`, HttpStatus.NOT_FOUND);
    }
    return post;
}


//make a credited post 
async makepost(postdto: VendorMakePostDto, vendorid: string): Promise<IVendorPostResponse> {
    try {
        const vendor = await this.verifyVendor(vendorid);

        const cvnmodel = postdto.cvnmodel
        const cvnphotographer =postdto.cvnphotographer

        const contractModel = await this.verifyContract(cvnmodel);
        const contractPhotographer = await this.verifyContract(cvnphotographer);



        const newpost = new VendorPostsEntity();
        newpost.caption = postdto.caption;
        newpost.media = postdto.media;
        newpost.availability = postdto.availability
        newpost.cost = postdto.cost
        newpost.creditedModel = contractModel.model;
        newpost.creditedPhotographer = contractPhotographer.photographer;
        newpost.createdDate = new Date();
        newpost.owner = vendor;
        await this.vendorpostrepository.save(newpost);


        const customerResponses: IVendorPostResponse = {
            id:newpost.id,
            creditedModel: newpost.creditedModel,
            creditedPhotographer: newpost.creditedPhotographer,
            media: newpost.media,
            caption: newpost.caption,
            cost: newpost.cost,
            availability : newpost.availability,
            createdDate: newpost.createdDate,
            owner: {
                display_photo: newpost.owner.id,
                brandname: newpost.owner.brandname
            }
        };

        return customerResponses;
    } catch (error) {
        throw error;
    }
}


// async getMyposts(): Promise<IVendorPostResponse[]> {
    

//     const myposts = await this.vendorpostrepository.find();


//     const postResponses: IVendorPostResponse[] = myposts.map(post => ({
//         creditedModel: post.creditedModel,
//         creditedPhotographer: post.creditedPhotographer,
//         media: post.media,
//         caption: post.caption,
//         cost: post.cost,
//         availability: post.availability,
//         createdDate: post.createdDate,
//         owner: {
//             display_photo: post.owner.id,
//             brandname: post.owner.brandname
//         }
//     }));

//     return myposts;
// }



async MakeCommentOnpost(dto:MakeCommentDto,postid:number,vendorid:string):Promise<{message:string}>{
    const post=await this.verifyPost(postid)
    const vendor= await this.verifyVendor(vendorid)

    const comment = new Comments()
    comment.content= dto.comment,
    comment.vendor=post,
    await this.commentrepository.save(comment)

    return {message:"your comment has been sent "}


}

async getMyoffers(vendor: string): Promise<ContractsOfffer[]> {
    const offersForModel = await this.offerripo.find({ where: { vendor: vendor } });
    if (!offersForModel || offersForModel.length === 0) {
      throw new HttpException('No offers found for the specified vendor', HttpStatus.NOT_FOUND);
    }
    return offersForModel;
  }


async getMyCounteroffers(vendor: string): Promise<CounterContractsOfffer[]> {
    const offersForModel = await this.counterripo.find({ where: { vendor: vendor } });
    if (!offersForModel || offersForModel.length === 0) {
      throw new HttpException('No counter offers found for the specified vendor', HttpStatus.NOT_FOUND);
    }
    return offersForModel;
  }


}

