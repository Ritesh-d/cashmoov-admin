import { Routes } from '@angular/router';

import { Dashboard1Component } from './dashboard1/dashboard1.component';

import { AuthGuard } from '../guards/auth.guard';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: Dashboard1Component,
        canActivate : [AuthGuard],
        data: {
          title: 'CASHMOOV_DASHBOARD',
          urls: [
            { title: 'LABEL_HOME', url: '/dashboard' },
            { title: 'LABEL_DASHBOARD', url: '/dashboard' },
            { title: 'CASHMOOV_DASHBOARD' }]
        }}
      
    ]
  }
];
