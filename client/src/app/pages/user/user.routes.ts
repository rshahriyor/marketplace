import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./user').then((c) => c.User),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'm-c',
            },
            {
                path: 'p',
                loadComponent: () => import('./profile/profile').then((c) => c.Profile),
            },
            {
                path: 'm-c',
                loadComponent: () => import('./my-companies/my-companies').then((c) => c.MyCompanies),
            },
            {
                path: 'a-c',
                loadComponent: () => import('./my-companies/company-form/company-form').then((c) => c.CompanyForm),
            },
            {
                path: 'a-c/:id',
                loadComponent: () => import('./my-companies/company-form/company-form').then((c) => c.CompanyForm),
            }
        ]
    }
]
