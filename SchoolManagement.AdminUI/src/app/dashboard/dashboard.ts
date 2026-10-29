
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, finalize } from 'rxjs';
import { environment } from '../enviroments/enviroment';

interface School {
  schoolId: number;
  name: string;
}

interface User {
  userId: number;
  fullName: string;
  email: string;
  isActive: boolean;
  phoneNumber: string | null;
  address: string | null;
}

interface ApiResponse<T> {
  message?: string;
  data: T;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private readonly apiUrl = `${environment.apiUrl}`;

  totalSchools = 0;
  totalUsers = 0;
  activeUsers = 0;
  inactiveUsers = 0;

  recentUsers: User[] = [];

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
      schools: this.http.get<ApiResponse<School[]>>(
        `${this.apiUrl}/School/all-school`
      ),
      users: this.http.get<ApiResponse<User[]>>(
        `${this.apiUrl}/User/users`
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
          const schoolsResponse: any = response.schools;
         const schools = Array.isArray(schoolsResponse)
    ? schoolsResponse
    : schoolsResponse?.data;
        const users = response.users.data ?? [];

        this.totalSchools = schools.length;
        this.totalUsers = users.length;

        this.activeUsers = users.filter(
          user => user.isActive
        ).length;

        this.inactiveUsers = users.filter(
          user => !user.isActive
        ).length;

        this.recentUsers = [...users]
          .sort((a, b) => b.userId - a.userId)
          .slice(0, 5);

        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage =
          'Unable to load dashboard data. Please check your login and API permissions.';

        this.cdr.detectChanges();
      }
    });
  }
}
