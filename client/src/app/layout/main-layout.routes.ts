import { Routes } from '@angular/router';

export const MAIN_LAYOUT_CHILDREN_ROUTES: Routes = [
    {
        path: 'm-i',
        loadComponent: () => import('../pages/company-filter/company-filter').then(c => c.CompanyFilter)
    },
    {
        path: 'm/:id',
        loadComponent: () => import('../pages/company-detail/company-detail').then(c => c.CompanyDetail)
    },
    {
        path: 'u',
        loadChildren: () => import('../pages/user/user.routes').then((r) => r.USER_ROUTES),
    },
]
