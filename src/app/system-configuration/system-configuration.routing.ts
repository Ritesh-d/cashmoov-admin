import { Routes } from '@angular/router';

import { SearchSystemConfigurationComponent } from './search-system-configuration/search-system-configuration.component';




export const SystemConfigurationRoutes : Routes = [
    {
        path : '',
        children : [
            {
                path : 'searchsystemconfiguration',
                component: SearchSystemConfigurationComponent,
                data: {
                expectedRole : '/systemconfiguration/searchsystemconfiguration',
                title: 'lbl_role_type',
                urls: [{ title: 'LABEL_HOME' , url: '/dashboard/dashboard1' },{ title: 'lbl_system_configuration' , url: '/systemconfiguration/searchsystemconfiguration'}, { title: 'brcr_system_configuration' }]
                }
                
            },
                   
]
}
];
