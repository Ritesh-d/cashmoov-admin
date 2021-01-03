export interface SubscriberAddressRequestModel {
    walletOwnerCode: string;
    addressList: {
        addTypeCode: string;
        addressLine1: string;
        addressLine2: string;
        regionalArea: string;
        governorateCode: string;
        regionCode: string;
        territoryCode: string;
        location: string;
    }[];
}
