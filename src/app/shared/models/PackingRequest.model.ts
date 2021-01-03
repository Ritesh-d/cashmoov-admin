import { PackageCodeModel } from './PackageCode.model';
import { PackingModel } from './Packing.model';

export class PackingRequestModel{
    action : string;
    request : PackingModel;
}

export class PackingRequestModelForcreatwePacking{
    requestType : string;
    request : PackingModel;
}