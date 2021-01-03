export interface PermissionRequestModel {
    featuresList: {
        approve: string;
        view: string;
        create: string;
        delete: string;
        edit: string;
        featuresCode: string;
    }[];
    roleCode: string;
}