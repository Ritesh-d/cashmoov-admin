import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

  {
    path: '/wallet-owner',
    title: 'Wallet Owner',
    icon: 'mr-2 fas fa-user',
    class: '',
    code: 100006,
    label: '3',
    heading: 'Wallet Owner Management',
    headingcode: '01',
    labelClass: 'label label-rouded label-themecolor pull-right',
    extralink  :false,
     
    submenu: [
    ]
  },
   {
    path: '/employer',
    title: 'Employer',
    // icon: 'mr-2 fa fa-industry',
    icon: 'mr-2 fa fa-user',
    class: '',

    code : 100034, 
    label: '3',
    heading: 'Wallet Owner Management',
    headingcode: '01',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/subscriber-owner',
    title: 'Subscriber',
    icon: 'mr-2 fas fa-user',
    class: '',
 
    code : 100035, 
    label: '3',
    heading: 'Wallet Owner Management',
    headingcode: '01',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/merchant',
    title: 'Merchant',
    icon: 'mr-2 fas fa-user',
    class: '',
 
    code : 100037, 
    label: '3',
    heading: 'Wallet Owner Management',
    headingcode: '01',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  
  // {
  //   path: '/walletownercategory',
  //   title: 'Wallet Management',
  //   icon: 'mr-2 fas fa-wallet',
  //   class: '',
  //   code: 100006,
  //   label: '3',
  //   heading: 'Control Account',
  //   headingcode: '01',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [

     
  //   ]
  // },
  {
    path: '/walletownercategory',
    title: 'Control Account',
    icon: 'mr-2 fas fa-wallet',
    class: '',
    code: 100036,
    // code: 100006,
    label: '3',
    heading: 'E-Money Management',
    headingcode: '05',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
    
  },
  {
    path: '/emoneycreation',
    title: 'E-Money Creation',
    icon: 'mr-2 fas fa fa-money',
    class: '',
    code: 100028,
    
    label: '3',
    heading: 'E-Money Management',
    headingcode: '05',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
   
  },
  
  {
    path: '/feature',
    title: 'Feature',
    icon: 'mr-2 fas fa-key',
    class: '',
    // code: 100016,
    code: 100038,
    label: '3',
    heading: 'System User management',
    headingcode: '02',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/rolegroup',
    title: 'Role',
    icon: 'mr-2 fas fa-address-book',
    class: '',
    code: 100008,
    label: '3',
    heading: 'System User management',
    headingcode: '02',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  // {
  //   path: '/rolepermission',
  //   title: 'Permission',
  //   icon: 'mr-2 fas fa-address-book',
  //   class: '',
  //   code: 100009,
  //   label: '3',
  //   heading: 'System User management',
  //   headingcode: '02',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // },
  {
    path: '/user',
    title: 'System User',
    icon: 'mr-2 fas fa-user-cog',
    class: '',
    code: 100007,
    label: '3',
    heading: 'System User management',
    headingcode: '02',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/templates',
    title: 'Template',
    icon: 'mr-2 fas fa-border-style',
    class: '',
    code: 100011,
    label: '3',
    heading: 'Template Management',
    headingcode: '03',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  // {
  //   path: '/groups',
  //   title: 'Groups',
  //   icon: 'mr-2 fas fa-users',
  //   class: '',
  //   code: 100010,
  //   label: '3',
  //   heading: 'Template Management',
  //   headingcode: '03',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // },
  {
    path: '/approval',
    title: 'Approval',
    icon: 'mr-2 fas fa-check',
    class: '',
    code: 100039,
    // code: 100006,
    label: '3',
    heading: '',
    headingcode: '04',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  // {
  //   path: '',
  //   title: 'Reports',
  //   icon: 'mr-2 fas fa-chart-bar',
  //   class: '',
  //   code: 6,
  //   label: '3',
  //   heading: 'other',
  //   headingcode: '04',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // }
  // ,
  //  {
  //   path: '',
  //   title: 'Configuration',
  //   icon: 'mr-2 fas fa-cog',
  //   class: '',
  //   code:7,
  //   label: '3',
  //   heading:'other',
  //   headingcode:'04',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // },
  // {
  //   path: '',
  //   title: 'Bulk Upload',
  //   icon: 'mr-2 fas fa-layer-group',
  //   class: '',
  //   code: 100012,
  //   label: '3',
  //   heading: 'other',
  //   headingcode: '04',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // },
  // {
  //   path: '',
  //   title: 'Kyc',
  //   icon: 'mr-2 fas fa-file-image',
  //   class: '',
  //   code: 100013,
  //   label: '3',
  //   heading: 'other',
  //   headingcode: '04',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // },
  // {
  //   path: '',
  //   title: 'Profile',
  //   icon: 'mr-2 fas fa-id-card',
  //   class: '',
  //   code: 100014,
  //   label: '3',
  //   heading: 'other',
  //   headingcode: '04',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // },
  // {
  //   path: '',
  //   title: 'Commision',
  //   icon: 'mr-2 fas fa-percent',
  //   class: '',
  //   code: 100001,
  //   label: '3',
  //   heading: 'other',
  //   headingcode: '04',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // },
  // {
  //   path: '',
  //   title: 'Promotion',
  //   icon: 'mr-2 fas fa-money',
  //   class: '',
  //   code: 100000,
  //   label: '3',
  //   heading: 'other',
  //   headingcode: '04',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // },
  // {
  //   path: '',
  //   title: 'Reports',
  //   icon: 'mr-2 fas fa-bar-chart ',
  //   class: '',
  //   code: 100003,
  //   label: '3',
  //   heading: 'other',
  //   headingcode: '04',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // },
  {
    path: '',
    title: 'Transaction',
    icon: 'mr-2 fas fa-bar-chart ',
    class: '',
    code: 100004,
    label: '3',
    heading: 'other',
    headingcode: '04',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  // {
  //   path: '/manageusersgroup',
  //   title: 'Manage Users Group',
  //   icon: 'mr-2 fas fa-layer-group',
  //   class: '',
  //   code: 100005,
  //   label: '3',
  //   heading: 'other',
  //   headingcode: '04',
  //   labelClass: 'label label-rouded label-themecolor pull-right',
  //      extralink  :false,
  //   submenu: [
  //   ]
  // },
  
  {
     path: '/country',
    title: 'Country',
     icon: 'mr-2 fas fa-layer-group',
    class: '',
    code: 100040,
    label: '3',
    heading: 'other',
    headingcode: '04',
    labelClass: '',
       extralink  :false,
    submenu: [
    ]
 
  },
 
  {
    path: '/exchangerate',
    title: 'Exchange Rate',
    icon: 'mr-2 fas fa-exchange-alt',
    class: '',
    code: 100015,
    label: '3',
    heading: 'other',
    headingcode: '04',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  
  {
    path: '/channel',
    title: 'Channel',
    icon: 'mr-2 fas fa-columns',
    class: '',
    code: 100041,
    label: '3',
    heading: 'other',
    headingcode: '04',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
    {
    path: '/taxconfiguration',
    title: 'Tax Configuration',
    icon: 'mr-2  fas fa-percent',
    class: '',
    code: 100030,
    label: '3',
    heading: 'other',
    headingcode: '04',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },{
    path: '/transactionreversal',
    title: 'Reversal',
    icon: 'mr-2 fas fa-border-style',
    class: '',
    code: 100045,
    label: '3',
    heading: 'other',
    headingcode: '04',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
    {
    path: '/wallettransfer/add',
    title: 'Wallet Transfer',
    icon: 'mr-2  fas fa-wallet',
    class: '',
    code: 100031,
    label: '3',
    heading: 'other',
    headingcode: '05',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/report/agent-ageing',
    title: 'Agent Ageing Report',
    icon: 'mr-2  fas fa-user',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/report/transaction-summary',
    title: 'Transaction Summary Report',
    icon: 'mr-2  fas fa-money',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/report/transaction-detail',
    title: 'Transaction Detail Report',
    icon: 'mr-2  fas fa-exchange-alt',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/report/commission-detail',
    title: 'Commission Detail Report',
    icon: 'mr-2  fas fa-money',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/report/agent-balance',
    title: 'Agent Balance Report',
    icon: 'mr-2  fas fa-balance-scale',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/report/control-account',
    title: 'Control Account Report',
    icon: 'mr-2  fas fa-user',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/report/registration-report',
    title: 'Registration Report',
    icon: 'mr-2  fas fa-registered',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
      extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/report/subscriber-ageing',
    title: 'Subscriber Ageing Report',
    icon: 'mr-2  fa fa-scribd',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
      extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/report/hierarchy-transaction',
    title: 'Hierarchy Transaction Report',
    icon: 'mr-2  fas fa-money',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
      extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/report/registration-report',
    title: 'Registration Report',
    icon: 'mr-2  fas fa-history',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
    extralink: false,
    submenu: [
    ]
  },
  {
    path: '/report/subscriber-ageing',
    title: 'Subscriber Ageing Report',
    icon: 'mr-2  fas fa-history',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
    extralink: false,
    submenu: [
    ]
  },
  {
    path: '/report/hierarchy-transaction',
    title: 'Hierarchy Transaction Report',
    icon: 'mr-2  fas fa-history',
    class: '',
    code: 100003,
    label: '3',
    heading: 'Reports',
    headingcode: '06',
    labelClass: 'label label-rouded label-themecolor pull-right',
    extralink: false,
    submenu: [
    ]
  },
  {
    path: '/service',
    title: 'Service',
    icon: 'mr-2  fa fa-list',
    class: '',
    code: 100042,
    label: '3',
    heading: 'Product Category',
    headingcode: '07',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },
  {
    path: '/product',
    title: 'Product',
    icon: 'mr-2 fab fa-product-hunt',
    class: '',
    code: 100043,
    label: '3',
    heading: 'Product Category',
    headingcode: '07',
    labelClass: 'label label-rouded label-themecolor pull-right',
       extralink  :false,
    submenu: [
    ]
  },

 ];
