export class RolePermissionModel {
    constructor(){}
    id: number;
    role: string;
    permission :string;
    featuresCode: string;
    createdOn: Date;
    create: Boolean;
    view: Boolean;
    edit: Boolean;
    approve: Boolean;
    delete :Boolean;
    status : string;
    featureList : any;

}