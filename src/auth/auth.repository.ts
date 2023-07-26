import { EntityRepository, Repository } from "typeorm";
import { CustomerEntity } from "../Entity/Users/customer.entity";
import { vendorEntity } from "../Entity/Users/vendor.entity";
import { ModelEntity } from "../Entity/Users/model.entity";
import { PhotographerEntity } from "../Entity/Users/photorapher.entity";
import { AdminEntity } from "../Entity/Users/admin.entity";
import { UserOtp } from "../Entity/userotp.entity";
import { Notifications } from "../Entity/Notification/notification.entity";


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

