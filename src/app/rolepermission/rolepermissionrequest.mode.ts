import { RolePermissionModel } from "./rolepermission.model";


export class RolePermissionRequestModel{
    constructor(){}

    name : string;
    roleCode : string;
    featuresList: any = [];
}
