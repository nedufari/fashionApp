import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../Entity/Users/customer.entity';
import {
  CommentsRepository,
  CustomerEntityRepository,
  NotificationsRepository,
  RepliesRepository,
  VendorEntityRepository,
} from '../../auth/auth.repository';
import {
  CustomerMakeCommentDto,
  CustomerReplyDto,
  LikeDto,
  UpdateCustomerDataDto,
} from './customers.dto';
import {
  Comments,
  ICustomerCommentResponse,
} from '../../Entity/Activities/comment.entity';
import {
  IVendorPostResponse,
  IvndorPostResponseWithComments,
  VendorPostsEntity,
} from '../../Entity/Posts/vendor.post.entity';
import { VendorPostRepository } from '../../contract/contrct.repository';
import {
  ICustomerReplyResponse,
  Replies,
} from '../../Entity/Activities/reply.entity';
import { LikeAction } from '../../Enums/post.enum';
import { IVendor } from '../vendor/vendor.interface';
import { Any, Like } from 'typeorm';
import { vendorEntity } from '../../Entity/Users/vendor.entity';
import { Niche4Vendors } from '../../Enums/niche.enum';
import {
  INotificationResponse,
  Notifications,
} from '../../Entity/Notification/notification.entity';
import { NotificationType } from '../../Enums/notificationTypes.enum';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name); // Create a logger instance

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerripository: CustomerEntityRepository,
    @InjectRepository(VendorPostsEntity)
    private readonly vendorpostripo: VendorPostRepository,
    @InjectRepository(Comments)
    private readonly commentripo: CommentsRepository,
    @InjectRepository(Replies) private readonly replyripo: RepliesRepository,
    @InjectRepository(Notifications)
    private notificationrepository: NotificationsRepository,
    @InjectRepository(vendorEntity)
    private vendorrepository: VendorEntityRepository,
  ) {}

  //send order request on a particular post
  //mke payment

  //make a comment
  async makeComment(
    postid: number,
    customerid: string,
    commentdto: CustomerMakeCommentDto,
  ): Promise<ICustomerCommentResponse> {
    try {
      const findpost = await this.vendorpostripo.findOne({
        where: { id: postid },
      });
      if (!findpost)
        throw new HttpException('the post is not found', HttpStatus.NOT_FOUND);

      const customer = await this.customerripository.findOne({
        where: { id: customerid },
      });
      if (!customer)
        throw new HttpException(
          'the customer  is not found',
          HttpStatus.NOT_FOUND,
        );

      const comment = new Comments();
      (comment.content = commentdto.comment), 
      (comment.customer = customer);
      (comment.post = findpost)
      
      
      await this.commentripo.save(comment);

      //save the notification
      const notification = new Notifications();
      notification.account = customer.id;
      notification.subject = 'made a comment!';
      notification.notification_type = NotificationType.customer_commented;
      notification.message = `Hello ${customer.username}, just made a comment on ${findpost.caption}`;
      await this.notificationrepository.save(notification);

      const commentResponse: ICustomerCommentResponse = {
        id: comment.id,
        content: comment.content,
        customer: {
          digital_photo: customer.digital_photo,
          username: customer.username,
        },
      };
      this.logger.log(
        `comment made on post ${postid} by customer ${customerid}`,
      );
      return commentResponse;
    } catch (error) {
      throw error;

      //this.logger.error(`an error occured: ${error.message}`,error.stack)
    }
  }

  //reply comments
  async replycomment(
    commentid: number,
    customerid: string,
    replydto: CustomerReplyDto,
  ): Promise<ICustomerReplyResponse> {
    try {
      const findcomment = await this.commentripo.findOne({
        where: { id: commentid },
      });
      if (!findcomment)
        throw new HttpException('the post is not found', HttpStatus.NOT_FOUND);

      const customer = await this.customerripository.findOne({
        where: { id: customerid },
      });
      if (!customer)
        throw new HttpException(
          'the customer  is not found',
          HttpStatus.NOT_FOUND,
        );

      const reply = new Replies();
      (reply.reply = replydto.reply), (reply.comment = findcomment);
      (reply.customer = customer), await this.replyripo.save(reply);

      //save the notification
      const notification = new Notifications();
      notification.account = customer.id;
      notification.subject = 'replied a comment!';
      notification.notification_type =
        NotificationType.customer_replied_a_comment;
      notification.message = `Hello ${customer.username}, just replied a comment `;
      await this.notificationrepository.save(notification);

      const ReplyResponse: ICustomerReplyResponse = {
        id: reply.id,

        comment: {
          comment: findcomment.content,
        },
        reply: reply.reply,
        customer: {
          digital_photo: customer.digital_photo,
          username: customer.username,
        },
      };
      this.logger.log(
        `this reply ${reply.reply} was given to this comment ${findcomment.content}`,
      );

      return ReplyResponse;
    } catch (error) {
      this.logger.error(`An error occurred: ${error.message}`, error.stack);
    }
  }

  //like a post
  async likeAPost(
    postid: number,
    customerid: string,
    likedto: LikeDto,
  ): Promise<{ message: string }> {
    try {
      const findpost = await this.vendorpostripo.findOne({
        where: { id: postid },
      });
      if (!findpost) {
        throw new HttpException('The post is not found', HttpStatus.NOT_FOUND);
      }

      const customer = await this.customerripository.findOne({
        where: { id: customerid },
      });
      if (!customer) {
        throw new HttpException(
          'The customer is not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (likedto.action === LikeAction.LIKE) {
        // Check if the post has been liked by the same user before
        if (findpost.likedBy && findpost.likedBy.includes(customer.username)) {
          return { message: 'You have already liked this post' };
        }

        // Check if the post has been disliked by the same user before
        if (
          findpost.dislikedBy &&
          findpost.dislikedBy.includes(customer.username)
        ) {
          const dislikedIndex = findpost.dislikedBy.indexOf(customer.username);
          findpost.dislikedBy.splice(dislikedIndex, 1);
          findpost.dislikes -= 1;
        } else {
          // Initialize the dislikedBy array if it's null
          findpost.dislikedBy = [];
        }

        findpost.likes += 1;
        findpost.likedBy = findpost.likedBy || [];
        findpost.likedBy.push(customer.username);
        await this.vendorpostripo.save(findpost);

        //save the notification
        const notification = new Notifications();
        notification.account = customer.id;
        notification.subject = 'liked a post!';
        notification.notification_type = NotificationType.customer_liked_a_post;
        notification.message = `Hello ${customer.username}, just liked a post `;
        await this.notificationrepository.save(notification);

        this.logger.log(
          `this post ${findpost.caption} just got a like from ${customer.username} and the total number of like for the post is ${findpost.likes}`,
        );

        return { message: 'You have liked this post' };
      }
    } catch (error) {
      this.logger.error(`an error occured ${error.message} `, error.stack);
    }
  }

  

  async getMyNotifications(customer: string): Promise<INotificationResponse[]> {
    const mynotifications = await this.notificationrepository.find({
      where: { account: customer },
    });
    if (!mynotifications || mynotifications.length === 0) {
      throw new HttpException('No notifications found', HttpStatus.NOT_FOUND);
    }
    const notificationResponse: INotificationResponse[] = mynotifications.map(
      (notifcation) => ({
        message: notifcation.message,
        notification_type: notifcation.notification_type,
        subject: notifcation.subject,
        date: notifcation.date,
      }),
    );

    return notificationResponse;
  }

  //dislike a post
  async DislikeAPost(
    postid: number,
    customerid: string,
    likedto: LikeDto,
  ): Promise<{ message: string }> {
    try {
      const findpost = await this.vendorpostripo.findOne({
        where: { id: postid },
      });
      if (!findpost) {
        throw new HttpException('The post is not found', HttpStatus.NOT_FOUND);
      }

      const customer = await this.customerripository.findOne({
        where: { id: customerid },
      });
      if (!customer) {
        throw new HttpException(
          'The customer is not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (likedto.action === LikeAction.DISLIKE) {
        // Check if the post has been liked by the same user before
        if (
          findpost.dislikedBy &&
          findpost.dislikedBy.includes(customer.username)
        ) {
          return { message: 'You have already disliked this post' };
        }

        // Check if the post has been disliked by the same user before
        if (findpost.likedBy && findpost.likedBy.includes(customer.username)) {
          const likedIndex = findpost.likedBy.indexOf(customer.username);
          findpost.likedBy.splice(likedIndex, 1);
          findpost.likes -= 1;
        } else {
          // Initialize the likedBy array if it's null
          findpost.likedBy = [];
        }

        findpost.dislikes += 1;
        findpost.dislikedBy = findpost.likedBy || [];
        findpost.dislikedBy.push(customer.username);
        await this.vendorpostripo.save(findpost);

        //save the notification
        const notification = new Notifications();
        notification.account = customer.id;
        notification.subject = 'disliked a post!';
        notification.notification_type =
          NotificationType.customer_disliked_a_post;
        notification.message = `Hello ${customer.username}, just disliked a post `;
        await this.notificationrepository.save(notification);

        this.logger.log(
          `this post ${findpost.caption} just got a dislike from ${customer.username} and the total number of like for the post is ${findpost.likes}`,
        );

        return { message: 'You have disliked this post' };
      }
    } catch (error) {
      this.logger.error(`an error occured ${error.message} `, error.stack);
    }
  }

  //get all posts

  async getAllPosts(): Promise<IvndorPostResponseWithComments[]> {
    try {
      const allPosts = await this.vendorpostripo.find({
        relations: ['owner','comments','comments.replies'], // Load the 'owner' relationship for each post
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
        comments: post.comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          replies: comment.replies.map((reply) => ({
            id: reply.id,
            reply: reply.reply,
          })),
        })),

        
      }));

      this.logger.log(`all the post just gor retrived by a customer`);

      return postResponses;
    } catch (error) {
      this.logger.error(`an error occured ${error.message} `, error.stack);
    }
  }

  //advanced query for vendors
  async searchVendors(
    keyword: any | string,
  ): Promise<{ photographers: IVendor[]; totalCount: number }> {
    try {
      const [photographers, totalCount] =
        await this.vendorrepository.findAndCount({
          where: [
            { username: Like(`%${keyword}%`) },
            { address: Like(`%${keyword}%`) },
            { gender: Like(`%${keyword}%`) },
            { brandname: Like(`%${keyword}%`) },
            { instagram: Like(`%${keyword}%`) },
            { twitter: Like(`%${keyword}%`) },
            { thread: Like(`%${keyword}%`) },
            { facebook: Like(`%${keyword}%`) },
            { bio: Like(`%${keyword}%`) },
            // Add more columns as needed for your search
          ],
          cache: false,
        });

      if (totalCount === 0)
        throw new NotFoundException(
          `No search results found for  "${keyword}"`,
        );

      this.logger.log('vendor successfully searched ');
      return { photographers, totalCount };
    } catch (error) {
      this.logger.error(`An error occurred: ${error.message}`, error.stack);
    }
  }

  async searchVendorsNiche(
    keyword: any | string,
  ): Promise<{ photographers: IVendor[]; totalCount: number }> {
    try {
      const query = `
                SELECT *
                FROM vendor_entity
                WHERE
                  username ILIKE $1
                  OR address ILIKE $1
                  OR gender ILIKE $1
                  OR brandname ILIKE $1
                  OR instagram ILIKE $1
                  OR twitter ILIKE $1
                  OR thread ILIKE $1
                  OR facebook ILIKE $1
                  OR bio ILIKE $1
                  OR $2 = ANY(niche)
              `;

      const values = [`%${keyword}%`, keyword];

      const photographers = await this.vendorrepository.query(query, values);

      const totalCount = photographers.length;

      if (totalCount === 0) {
        throw new NotFoundException(`No search results found for "${keyword}"`);
      }
      this.logger.log('vendor niche successfully searched ');
      return { photographers, totalCount };
    } catch (error) {
      this.logger.error(`An error occurred: ${error.message}`, error.stack);
    }
  }

  async updateProfilePics(
    filename: string,
    customerid: string,
  ): Promise<{ message: string }> {
    try {
      const customer = await this.customerripository.findOne({
        where: { id: customerid },
      });
      if (!customer) {
        throw new HttpException(
          'The customer is not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const fileurl = `http://localhost:3000/api/v1/customer/uploadfile/puplic/${filename}`;

      //update picture
      customer.digital_photo = fileurl;
      await this.customerripository.save(customer);

      //save the notification
      const notification = new Notifications();
      notification.account = customer.id;
      notification.subject = 'uploaded a profile picture!';
      notification.notification_type =
        NotificationType.customer_Uploaded_a_profilePicture;
      notification.message = `Hello ${customer.username}, just uploaded a profile picture `;
      await this.notificationrepository.save(notification);

      return { message: customer.digital_photo };
    } catch (error) {
      this.logger.error(`An error occurred: ${error.message}`, error.stack);
    }
  }
}
