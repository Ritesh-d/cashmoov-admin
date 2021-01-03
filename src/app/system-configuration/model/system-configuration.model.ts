export class SystemConfigurationModel{
    constructor(){}

    userId: string;
    status: string;
    channel: string;
    comments: string;
    requestcts: string;
     id: string;
     configurationCode: string;
     configuration_name: string;
     description: string;
     valuetype: string;
     defaultValue: string;
     minvalue: string;
     maxvalue: string;
     maxsize: string;
     modifiedallowed: string;
     displayallowed: string;
     allowedValue: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedOn: string;
    systemConfigurationList :any[];
    editSystemConfigList : any[];
}
export class ChangedList{
    constructor(){}

     configurationCode: string;
     
     defaultValue: string;
     minvalue: string;
     maxvalue: string;
     maxsize: string;
     minValue: string;
     maxValue: string;
     maxSize: string;
}
