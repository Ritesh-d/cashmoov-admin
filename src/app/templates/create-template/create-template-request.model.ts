export interface CreateTemplateRequestModel {
    templateCode: string;
    transTypeList: {
        transTypeCode: string;
    }[];
}