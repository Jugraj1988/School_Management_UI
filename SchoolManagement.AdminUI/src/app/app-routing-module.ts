import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Schools } from './schools/schools';
import { LoginComponent } from './auth/login/login';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: AdminLayout,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Super Admin' },
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: 'all-school',
        component: Schools
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}