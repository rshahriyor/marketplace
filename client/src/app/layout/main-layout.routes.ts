import { Routes } from '@angular/router';

export const MAIN_LAYOUT_CHILDREN_ROTES: Routes = [
    {
        path: 'm-i/:id',
        loadComponent: () => import('../pages/company-filter/company-filter').then(c => c.CompanyFilter)
    },
    {
        path: 'm/:id',
        loadChildren: () => import('../pages/company-detail/company-detail').then(c => c.CompanyDetail)
    },
    {
        path: 'user',
        loadChildren: () => import('../pages/user/user').then((r) => r.User),
    },
]
