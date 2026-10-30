import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Schools } from './schools/schools';
import { LoginComponent } from './auth/login/login';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Users } from './users/users';
import { NotFound } from './not-found/not-found';


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
      // Dashboard
      {
        path: '',
        component: Dashboard
      },

      // Schools
      {
        path: 'all-school',
        component: Schools
      },

      // Students
      // {
      //   path: 'all-students',
      //   component: Students
      // },

      // Teachers
      // {
      //   path: 'all-teachers',
      //   component: Teachers
      // },

      // Users
      {
        path: 'users',
        component: Users
      },

      // Roles
      // {
      //   path: 'all-roles',
      //   component: Roles
      // },
      // {

      // Permissions
      // {
      //   path: 'all-permissions',
      //   component: Permissions
      // },
    ]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFound
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}