import {CrudOperation} from './crudoperation'

export class RoleTypeModel{
    roleId : string;
    roleName : string;
    actionPriority : string;
    rendering:CrudOperation;
    selected:CrudOperation;
}