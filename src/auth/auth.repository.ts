import { EntityRepository, Repository } from "typeorm";
import { CustomerEntity } from "../Entity/Users/customer.entity";
import { vendorEntity } from "../Entity/Users/vendor.entity";
import { ModelEntity } from "../Entity/Users/model.entity";
import { PhotographerEntity } from "../Entity/Users/photorapher.entity";
import { AdminEntity } from "../Entity/Users/admin.entity";
import { UserOtp } from "../Entity/userotp.entity";
import { Notifications } from "../Entity/Notification/notification.entity";
import { VendorMakePostDto } from "../Users/vendor/vendor.dto";
import { VendorPostsEntity } from "../Entity/Posts/vendor.post.entity";
import { Comments } from "../Entity/Activities/comment.entity";
import { Replies } from "../Entity/Activities/reply.entity";
import { Wallet } from "../Entity/wallet/wallet.entity";
import { ModelTimelineEntity } from "../Entity/Posts/model.timeline.entity";
import { PhotographerTimelineEntity } from "../Entity/Posts/photographer.timeline.entity";
import { CustomerCartEntity } from "../Entity/Cart/customer.cart.entity";
import { CustomerCartItemEntity } from "../Entity/Cart/customer.cartitem.entity";
import { VendorProducts } from "../Entity/VendorProducts/vendor.products.entity";
import { ComplaintsEntity } from "../Entity/Activities/complaints.entity";


@EntityRepository(CustomerEntity)
export class CustomerEntityRepository extends Repository <CustomerEntity>{

}

@EntityRepository(vendorEntity)
export class VendorEntityRepository extends Repository <vendorEntity>{

}

@EntityRepository(ModelEntity)
export class ModelEntityRepository extends Repository <ModelEntity>{

}

@EntityRepository(PhotographerEntity)
export class PhotographerEntityRepository extends Repository <PhotographerEntity>{

}

@EntityRepository(AdminEntity)
export class AdminEntityRepository extends Repository <AdminEntity>{

}

@EntityRepository(UserOtp)
export class OtpRepository extends Repository <UserOtp>{

}


@EntityRepository(Notifications)
export class NotificationsRepository extends Repository <Notifications>{

}

@EntityRepository(VendorPostsEntity)
export class VendorMakePostRepository extends Repository <VendorPostsEntity>{

}

@EntityRepository(ModelTimelineEntity)
export class ModelTimeLineRepository extends Repository <ModelTimelineEntity>{

}

@EntityRepository(PhotographerTimelineEntity)
export class PhotographerTimeLineRepository extends Repository <PhotographerTimelineEntity>{

}

@EntityRepository(Comments)
export class CommentsRepository extends Repository <Comments>{

}


@EntityRepository(Replies)
export class RepliesRepository extends Repository <Replies>{

}

@EntityRepository(Wallet)
export class WalletRepository extends Repository <Wallet>{

}

@EntityRepository(CustomerCartEntity)
export class CustomerCartRepository extends Repository <CustomerCartEntity>{

}

@EntityRepository(CustomerCartItemEntity)
export class CustomerCartItemRepository extends Repository <CustomerCartItemEntity>{

}

@EntityRepository(VendorProducts)
export class VendorProductRepository extends Repository <VendorProducts>{

}

@EntityRepository(ComplaintsEntity)
export class ComplaintRepository extends Repository <ComplaintsEntity>{

}

