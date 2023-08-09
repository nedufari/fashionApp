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
import { ContractRepository } from "../../contract/contrct.repository";
import { Comments } from "../../Entity/Activities/comment.entity";
import { MakeCommentDto } from "../model/model.dto";

@Injectable()
export class VendorService{
    constructor(@InjectRepository(VendorPostsEntity)private vendorpostrepository:VendorMakePostRepository,
    @InjectRepository(vendorEntity)private vendorrepository:VendorEntityRepository,
    @InjectRepository(PhotographerEntity)private photographerrepository:PhotographerEntityRepository,
    @InjectRepository(ModelEntity)private modelrepository:ModelEntityRepository,
    @InjectRepository(Notifications)private notificationrepository:NotificationsRepository,
    @InjectRepository(Contracts)private contractrepository:ContractRepository,
    @InjectRepository(Comments)private commentrepository:CommentsRepository,
    
){}


private async verifyVendor(vendorid: string): Promise<vendorEntity> {
    const vendor = await this.vendorrepository.findOne({ where: { VendorID: vendorid, is_verified: true } });
    if (!vendor) {
        throw new HttpException(`The vendor is not found or not verified on this platform.`, HttpStatus.NOT_FOUND);
    }
    return vendor;
}

private async verifyPhotographer(photographerid: string): Promise<PhotographerEntity> {
    const photographer = await this.photographerrepository.findOne({ where: { PhotographerID: photographerid, is_verified: true } });
    if (!photographer) {
        throw new HttpException(`The photographer is not found or not verified on this platform.`, HttpStatus.NOT_FOUND);
    }
    return photographer;
}

private async verifyModel(modelid: string): Promise<ModelEntity> {
    const model = await this.modelrepository.findOne({ where: { ModelID: modelid, is_verified: true } });
    if (!model) {
        throw new HttpException(`The model is not found or not verified on this platform.`, HttpStatus.NOT_FOUND);
    }
    return model;
}

private async verifyContract(cvn: string, entityName: string): Promise<Contracts> {
    const contract = await this.contractrepository.findOne({ where: { contract_validity_number: cvn, [entityName]: true } });
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
async makepost(postdto: VendorMakePostDto, vendorid: string, modelid: string, photographerid: string, cvnmodel: string, cvnphotographer: string): Promise<IVendorPostResponse> {
    try {
        const vendor = await this.verifyVendor(vendorid);
        const photographer = await this.verifyPhotographer(photographerid);
        const model = await this.verifyModel(modelid);

        const contractModel = await this.verifyContract(cvnmodel, model.username);
        const contractPhotographer = await this.verifyContract(cvnphotographer, photographer.username);

        const newpost = new VendorPostsEntity();
        newpost.caption = postdto.caption;
        newpost.media = postdto.media;
        newpost.creditedModel = contractModel.model;
        newpost.creditedPhotographer = contractPhotographer.photographer;
        newpost.createdDate = new Date();
        newpost.owner = vendor;
        await this.vendorpostrepository.save(newpost);


        const customerResponses: IVendorPostResponse = {
            creditedModel: newpost.creditedModel,
            creditedPhotographer: newpost.creditedPhotographer,
            media: newpost.media,
            caption: newpost.caption,
            createdDate: newpost.createdDate,
            owner: newpost.owner,
        };

        return customerResponses;
    } catch (error) {
        throw error;
    }
}


async MakeCommentOnpost(dto:MakeCommentDto,postid:number,vendorid:string):Promise<{message:string}>{
    const post=await this.verifyPost(postid)
    const vendor= await this.verifyVendor(vendorid)

    const comment = new Comments()
    comment.content= dto.comment,
    comment.vendor=post,
    await this.commentrepository.save(comment)

    return {message:"your comment has been sent "}

    

}


}

