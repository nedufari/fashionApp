import { EntityRepository, Repository } from "typeorm";
import { OrdinaryUserEntity } from "../Entity/users/ordinaryuser.entity";
import { FashionDesignerEntity } from "../Entity/users/fashiodesigner.entity";
import { PhotographerEntity } from "../Entity/users/photographers.entity";
import { FashionModelsEntity } from "../Entity/users/BrandModelsUsers/fashionmodels.entity";
import { HairModelsEntity } from "../Entity/users/BrandModelsUsers/hairmodels.entity";
import { SkincareModelsEntity } from "../Entity/users/BrandModelsUsers/skincaremodels.entity";
import { FootwearModelsEntity } from "../Entity/users/BrandModelsUsers/footwaremodels.entity";
import { KidsModelsEntity } from "../Entity/users/BrandModelsUsers/kidsmodels.entity";
import { MakeUpModelsEntity } from "../Entity/users/BrandModelsUsers/makeupmodels.entity";


// since we have eight different kind of user and tables we would have eight different repository
@EntityRepository(OrdinaryUserEntity)
export class OrdinaryUserRepository extends Repository <OrdinaryUserEntity>{

}

@EntityRepository(FashionDesignerEntity)
export class FashionDesignerRepository extends Repository <FashionDesignerEntity>{

}

@EntityRepository(PhotographerEntity)
export class PhotographerRepository extends Repository <PhotographerEntity>{

}

@EntityRepository(FashionModelsEntity)
export class FashionModelRepository extends Repository <FashionModelsEntity>{

}

@EntityRepository(HairModelsEntity)
export class HairModelRepository extends Repository <HairModelsEntity>{

}

@EntityRepository(SkincareModelsEntity)
export class SkincareModelRepository extends Repository <SkincareModelsEntity>{

}

@EntityRepository(FootwearModelsEntity)
export class FootwearModelRepository extends Repository <FootwearModelsEntity>{

}

@EntityRepository(KidsModelsEntity)
export class KidsModelRepository extends Repository <KidsModelsEntity>{

}

@EntityRepository(MakeUpModelsEntity)
export class MakeUpModelRepository extends Repository <MakeUpModelsEntity>{

}