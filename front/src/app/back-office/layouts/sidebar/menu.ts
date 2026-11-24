import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [

  {
    id: 200,
    label: ' MANAGEMENT USERS ',
    isTitle: true
  },
  {
    id: 201,
    label: 'Users  ',
    icon: ' las la-users',
    isCollapsed: true,
    subItems: [
      {
        id: 202,
        label: 'Users ',
        link: '/back-office/users',
        parentId: 201
      },
      {
        id: 203,
        label: 'Partners ',
        link: '/back-office/partners',
        parentId: 201
      }
    ]
  },{
    id: 204,
    label: 'Preferences ',
    icon: 'ri-compass-3-line',

    isCollapsed: true,
    subItems: [
      {
        id: 205,
        label: 'Preferences ',
        link: '/back-office/preferences',
        parentId: 204
      },

    ]
  },
  {
    id: 206,
    label: ' Services',
    //icon: 'mdi mdi-currency-usd',
    icon: 'ri-store-line ',
    isCollapsed: true,
    subItems: [
      {
        id: 207,
        label: ' Services',
        link: '/back-office/services',
        parentId: 206
      }
    ]
  },
  // FLIGHTS MANAGEMENT
  {
    id: 150,
    label: 'FLIGHTS MANAGEMENT',
    isTitle: true
  },
  {
    id: 151,
    label: 'Flights',
    icon: 'mdi mdi-airplane',

    // icon: 'las la-plane',
    isCollapsed: true,
    subItems: [
      {
        id: 152,
        label: 'Create Flight',
        link: 'createflight',
        parentId: 151
      },
      {
        id: 153,
        label: 'List Flight',
        link: 'listflight',
        parentId: 151
      },
      {
        id: 154,
        label: ' Reservation',
        link: 'reservflight',
        parentId: 151
      },
      {
        id: 155,
        label: 'Statistics',
        link: 'reservation-stats',
        parentId: 151
      }
    ]
  },


// DESTINATION MANAGEMENT
  {
    id: 160,
    label: 'DESTINATION MANAGEMENT',
    isTitle: true
  },
  {
    id: 161,
    label: 'Destinations',
    icon: 'las la-map-marked-alt',
    // icon: 'mdi mdi-map-marker',

    isCollapsed: true,
    subItems: [
      {
        id: 162,
        label: 'Create Destination',
        link: 'destinations/add',
        parentId: 161
      },
      {
        id: 164,
        label: 'List Destinations',
        link: 'destinations',
        parentId: 161
      }
    ]
  },

// ACTIVITY MANAGEMENT
  {
    id: 170,
    label: 'ACTIVITY MANAGEMENT',
    isTitle: true
  },
  {
    id: 171,
    label: 'Activities',
    icon: 'mdi mdi-hiking',
    isCollapsed: true,
    subItems: [
      {
        id: 172,
        label: 'List Activities',
        link: 'activities',
        parentId: 171
      } ,{
        id: 272,
        label: 'Create Activity',
        link: 'activities/add',
        parentId: 171
      }
    ]
  },
// ACTIVITY MANAGEMENT
  {
    id: 277,
    label: 'Events MANAGEMENT',
    isTitle: true
  },
  {
    id: 273,
    label: 'Events',
    icon: 'ri-calendar-event-line',
    isCollapsed: true,
    subItems: [
      {
        id: 176,
        label: 'List Events',
        link: 'events',
        parentId: 273
      } ,{
        id: 177,
        label: 'Create Event',
        link: 'events/add',
        parentId: 273
      }
    ]
  },


// BOUTIQUE MANAGEMENT
  {
    id: 175,
    label: 'BOUTIQUE MANAGEMENT',
    // icon: 'mdi mdi-store',
    isTitle: true
  },
  {
    id: 175,
    label: 'BOUTIQUE',
    isCollapsed: true,
    icon: 'mdi mdi-store',
    subItems: [
      {
        id: 176,
        label: 'Les statistiques',
        //icon: 'mdi mdi-store',
        link: '/back-office/shop/statistics',
        parentId: 175
      },
      {
        id: 176,
        label: 'Liste de Produits',
        //icon: 'mdi mdi-store',
        link: '/back-office/listproduct',
        parentId: 175
      },
      {
        id: 176,
        label: 'Liste de commandes',
        //icon: 'mdi mdi-store',
        link: '/back-office/listorder',
      },
      {
        id: 176,
        label: 'Suivi des commandes',
        //icon: 'mdi mdi-store',
        link: '/back-office/adddelivery',
        parentId: 175
      }
    ]
  },

// CLAIM MANAGEMENT
  {
    id: 178,
    label: 'CLAIM MANAGEMENT',
    isTitle: true
  },
  {
    id: 179,
    label: 'Claims',
    icon: 'mdi mdi-flag',
    link: '/components/claim'
  },

// COMMUNITY MANAGEMENT
  {
    id: 181,
    label: 'COMMUNITY MANAGEMENT',
    isTitle: true
  },
  {
    id: 182,
    label: 'Community',
    icon: 'mdi mdi-account-group',
    link: '/components/community'
  },

// PACK MANAGEMENT
{
  id: 185,
  label: 'Packs',
  icon: 'bx bxl-product-hunt',
  isCollapsed: true,
  subItems: [
    {
      id: 186,
      label: 'List Packs',
      link: '/back-office/packs/pack/getAll',
      parentId: 185
    },
    {
      id: 187,
      label: 'Add Pack',
      link: '/back-office/packs/pack/add',
      parentId: 185
    }
  ]
},
{
  id: 188,
  label: 'Discounts',
  icon: 'ri-percent-line',
  isCollapsed: true,
  subItems: [
    {
      id: 189,
      label: 'List Discounts',
      link: '/back-office/packs/discount/getAll',
      parentId: 188
    },
    {
      id: 190,
      label: 'Add Discount',
      link: '/back-office/packs/discount/add',
      parentId: 188
    }
  ]
},
{
  id: 191,
  label: 'Price Plans',
  icon: ' las la-money-check-alt',
  isCollapsed: true,
  subItems: [
    {
      id: 192,
      label: 'List Plans',
      link: '/back-office/packs/price-plan/getAll',
      parentId: 191
    }
  ]
},
{
  id: 193,
  label: 'Payments',
  icon: 'ri-refund-2-line',
  link: '/back-office/paiement/getAll'
},
{
  id: 194,
  label: 'Invoices',
  icon: 'ri-file-copy-2-line',
  link: '/back-office/paiement/getAllFactures'
},
{
  id: 195,
  label: 'Reward points',
  icon: 'ri-award-line ',
  link: '/back-office/reward-points/getAll'
},
]