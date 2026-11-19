
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Schools } from './schools/schools';
import { LoginComponent } from './auth/login/login';
import { Teachers } from './teachers/teachers';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { Students } from './students/students';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

import { Users } from './users/users';
import { NotFound } from './not-found/not-found';

import { SchoolAdminLayout } from './layouts/school-admin-layout/school-admin-layout';
import { SchoolAdminDashboard } from './pages/school-admin-dashboard/school-admin-dashboard';

const routes: Routes = [

  // Login
  {
    path: 'login',
    component: LoginComponent
  },

  // Super Admin
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
      },

      {
        path: 'users',
        component: Users
      }

    ]
  },

  // School Admin
  {
    path: 'school-admin',
    component: SchoolAdminLayout,
    canActivate: [authGuard, roleGuard],
    data: { role: 'School Admin' },
    children: [

      {
        path: 'dashboard',
        component: SchoolAdminDashboard
      },

      {
        path: 'all-teachers',
        component: Teachers
      },

      {
        path: 'all-students',
        component: Students
      },

      {
        path: 'users',
        component: Users
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  },

  // Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Not found
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
