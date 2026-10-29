import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { AppRoutingModule } from './app-routing-module';

import { App } from './app';
import { LoginComponent } from './auth/login/login';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { Schools } from './schools/schools';
import { Users } from './users/users';
import { Roles } from './roles/roles';
import { NotFound } from './not-found/not-found';

@NgModule({
  declarations: [App, LoginComponent, AdminLayout, Dashboard, Schools, Users, Roles, NotFound],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}
