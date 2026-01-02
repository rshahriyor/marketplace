import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout';
import { MAIN_LAYOUT_CHILDREN_ROTES } from './layout/main-layout.routes';

export const routes: Routes = [
    {
        path: '', component: MainLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/home/home').then(c => c.Home)
            },
            ...MAIN_LAYOUT_CHILDREN_ROTES,
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)
    },
];
