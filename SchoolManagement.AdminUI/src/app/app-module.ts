import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

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
import { Teachers } from './teachers/teachers';
import { Students } from './students/students';
import { SchoolAdminLayout } from './layouts/school-admin-layout/school-admin-layout';
import { SchoolAdminDashboard } from './pages/school-admin-dashboard/school-admin-dashboard';
import { TeacherDashboard } from './features/teacher/teacher-dashboard/teacher-dashboard';
import { TeacherLayout } from './features/teacher/teacher-layout/teacher-layout';
import { TeacherStudents } from './features/teacher/teacher-students/teacher-students';
import { MyClasses } from './teacher/my-classes/my-classes';
import { Attendance } from './teacher/attendance/attendance';
import { AttendanceHistory } from './teacher/attendance-history/attendance-history';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    AdminLayout,
    Dashboard,
    Schools,
    Users,
    Roles,
    NotFound,
    Teachers,
    Students,
    SchoolAdminLayout,
    SchoolAdminDashboard,
    TeacherDashboard,
    TeacherLayout,
    TeacherStudents,
    MyClasses,
    Attendance,
    AttendanceHistory,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule, DatePipe],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}
