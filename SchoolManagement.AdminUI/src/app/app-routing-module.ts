
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
import { TeacherDashboard } from './features/teacher/teacher-dashboard/teacher-dashboard';
import { TeacherLayout } from './features/teacher/teacher-layout/teacher-layout';
import { TeacherStudents } from './features/teacher/teacher-students/teacher-students';
import { TeacherClasses } from './teacher/my-classes/my-classes';
import { Attendance } from './teacher/attendance/attendance';
import { AttendanceHistory } from './teacher/attendance-history/attendance-history';
import { Profile } from './shared/profile/profile';
import { StudentLayout } from './features/student/student-layout/student-layout';
import { StudentDashboard } from './features/student/dashboard/student-dashboard';
import { MyAttendance } from './features/student/my-attendance/my-attendance';
import { StudentClasses } from './features/student/my-classes/my-classes';
import { UpdatePassword } from './app/autht/update-password/update-password';

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
      },
      {
  path: 'update-password',
  component: UpdatePassword,
  canActivate: [authGuard],
},
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
  path: 'update-password',
  component: UpdatePassword,
  canActivate: [authGuard],
},

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  },

  //Teacher Pannel

  {
  path: 'teacher',
  component: TeacherLayout,
  canActivate: [authGuard, roleGuard],
  data: { role: 'Teacher' },
  children: [
    {
      path: 'dashboard',
      component: TeacherDashboard
    },
    {
      path: 'my-students',
      component: TeacherStudents
    },
    {
  path: 'my-classes',
  component: TeacherClasses
},
  {
  path: 'mark-attendance',
  component: Attendance
},
{
  path: 'attendance-history',
  component: AttendanceHistory
},
{ path: 'profile', component: Profile },
{
  path: 'update-password',
  component: UpdatePassword,
  canActivate: [authGuard],
},
  ]
},

{
  path: 'student',
  component: StudentLayout,
  canActivate: [authGuard],
  data: { role: 'Student' },
  children: [
    {
      path: 'dashboard',
      component: StudentDashboard
    },
    {
      path: 'my-profile',
      component: Profile
    },
    {
      path: 'my-classes',
      component: StudentClasses
    },
    {
      path: 'attendance',
      component: MyAttendance
    },
    // {
    //   path: 'results',
    //   component: Results
    // },
    {
  path: 'update-password',
  component: UpdatePassword,
  canActivate: [authGuard],
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
