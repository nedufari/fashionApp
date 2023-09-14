import { SetMetadata } from "@nestjs/common";
import { AdminTypes, Roles } from "../../Enums/roles.enum";

export const ROLES_KEY = 'roles'
export const Role=(...roles:AdminTypes[])=>SetMetadata(ROLES_KEY,roles);
