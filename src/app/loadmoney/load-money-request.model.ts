export interface CreateLoadMoneyRequestModel{
     // walletOwnerCategoryCode: string ,
      
     walletOwnerCode: string ,
     currencyCode: string ,
     amount: number,
     channelTypeCode:string;
     status?: string;
     bankReferenceNo : string,
     comments : string;
}