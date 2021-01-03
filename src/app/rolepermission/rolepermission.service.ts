import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RolePermissionModel } from './rolepermission.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { API_URLs } from '../shared/models/constants';
 

@Injectable()
export class RolePermissionService {
    
    constructor(private http: HttpClient,private router: Router,private apiurls: API_URLs) { }

    public rolePermissionModel: any;
    public sharedData : any;

    // public fetchSystemUserList(): RolePermissionModel[] {
    //     const systemUsers: RolePermissionModel[] = [

       
    //         {
    //             id: 101,
    //             role: 'role_1',
    //             permission: 'permission_1',
    //             featuresCode: 'WALLETOWNER',
    //             createdOn: new Date(),
    //             view: true,
    //             create : true,
    //             edit:true,
    //             approve:true,
    //             delete : true,
    //             status : 'Inactive'
                
    //         },
    //         {
    //             id: 102,
    //             role: 'role_2',
    //             permission: 'permission_2',
    //             featuresCode: 'WALLETOWNER',
    //             createdOn: new Date(),
    //             view: true,
    //             create : true,
    //             edit: true,
    //             approve:false,
    //             delete : true,
    //             status : 'Inactive'
                
    //         },
    //         {
    //             id: 103,
    //             role: 'role_3',
    //             permission: 'permission_3',
    //             featuresCode: 'WALLETOWNER',
    //             createdOn: new Date(),
    //             view: true,
    //             create : false,
    //             edit:true,
    //             approve:false,
    //             delete : false,
    //             status : 'Active'
                
    //         },
    //         {
    //             id: 104,
               
    //             role: 'role_4',
    //             permission: 'permission_4',
    //             featuresCode: 'WALLETOWNER',
    //             createdOn: new Date(),
    //             view: false,
    //             create : true,
    //             edit:false,
    //             approve:false,
    //             delete : false,
    //             status : 'Active'
                
    //         },
            
    //     ];

    //     this.rolePermissionModel = systemUsers;
    //     return systemUsers;
    // }

    public geSystemUserById(systemUserId: number): RolePermissionModel {
        for (let i = 0; i < this.rolePermissionModel.length; i++) {
            if (this.rolePermissionModel[i].id === systemUserId) {
                return this.rolePermissionModel[i];
            }
        }
       // return null;
    }

    public getCurrentURL() {
        return this.router.url;
    }

    public prepareUserAction(): boolean {
        const currentURL = this.getCurrentURL();
        if (currentURL.indexOf('/add') > -1) {
            return false;
        } else if (currentURL.indexOf('/edit') > -1) {
            return true;
        }
        return null;
    }

     
    createRolePermissionApi(url: string, request: any) {
        return this.http.post<any>(url, request)
        .toPromise()
        .then(data => {
            console.log("Response===============");
            console.log(JSON.stringify(data));
            
            return data
        }, error => {
            console.log("API error : " + JSON.stringify(error));
            return null;
        }
        ); 
    }

    async getrolesDetail(url:string) {
    
        
        const data =    await this.callGetApi(url);
       
        return data["roleList"];
         

    }
    async getFeatureDetail(url:string) {
    
        
        const data =    await this.callGetApi(url);
        this.sharedData = data["featureList"];
        this.sharedData.forEach(function(e){
            if (typeof e === "object" ){
              e["disabled"] = false
            }
          });
          return  this.sharedData;
         

    }
    async callGetApi(url:string) {
        return this.http.get<any>(url).toPromise()
        .then(data => {
            console.log("Response===============");
            console.log(JSON.stringify(data));
            
            return data;
        }, error => {
            console.log("API error : " + JSON.stringify(error));
            return null;
        }
        
        );     

        }
        async getPermissionDetail(url:string) {
            const data =    await this.callGetApi(url);
            if(data!=null){
                this.rolePermissionModel =data["permissionList"]
            return data["permissionList"];
            }else{
                return [];
            }
        }
         
        // get getPermissionDetail(): Observable<any> {
        //     return this.http.get(this.apiurls.URL_SEARCH_PERMISSION);
        // }
    
 
 

    
}
