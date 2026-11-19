import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, finalize } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

interface Teacher {
  teacherId: number;
  fullName: string;
  email: string;
  isActive: boolean;
  phoneNumber?: string | null;
}

interface Student {
  studentId: number;
  fullName: string;
  email: string;
  isActive: boolean;
  phoneNumber?: string | null;
}

interface ApiResponse<T> {
  message?: string;
  data?: T;
}

@Component({
  selector: 'app-school-admin-dashboard',
  standalone: false,
  templateUrl: './school-admin-dashboard.html',
  styleUrl: './school-admin-dashboard.css'
})
export class SchoolAdminDashboard implements OnInit {

  private readonly apiUrl = environment.apiUrl;

  // Teacher statistics
  totalTeachers = 0;
  activeTeachers = 0;
  inactiveTeachers = 0;

  // Student statistics
  totalStudents = 0;
  activeStudents = 0;
  inactiveStudents = 0;

  // Recent students
  recentStudents: Student[] = [];

  loading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      teachers: this.http.get<ApiResponse<Teacher[]>>(
        `${this.apiUrl}/Teacher/all-teachers`
      ),

      students: this.http.get<ApiResponse<Student[]>>(
        `${this.apiUrl}/Student/all-students`
      )
    })
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({

      next: (response) => {

        // Safely read API response data
        const teachers = response.teachers?.data ?? [];
        const students = response.students?.data ?? [];

        // Teacher statistics
        this.totalTeachers = teachers.length;

        this.activeTeachers = teachers.filter(
          teacher => teacher.isActive
        ).length;

        this.inactiveTeachers = teachers.filter(
          teacher => !teacher.isActive
        ).length;

        // Student statistics
        this.totalStudents = students.length;

        this.activeStudents = students.filter(
          student => student.isActive
        ).length;

        this.inactiveStudents = students.filter(
          student => !student.isActive
        ).length;

        // Get the five latest students
        this.recentStudents = [...students]
          .sort((a, b) => b.studentId - a.studentId)
          .slice(0, 5);

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Unable to load School Admin dashboard:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          error.error?.Message ||
          'Unable to load dashboard data. Please check your login and API permissions.';

        this.cdr.detectChanges();
      }

    });
  }
}