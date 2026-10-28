
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  roleId: string;
  roleName: string;
  fullName: string;
  email: string;
  isActive: boolean;
  schoolId: number | null;
  userId: number;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl =
    `${environment.apiUrl}/Authentication/login`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.apiUrl, credentials)
      .pipe(
        tap(response => {
          if (response?.token && response?.user) {
            localStorage.setItem('token', response.token);
            localStorage.setItem(
              'user',
              JSON.stringify(response.user)
            );
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    return this.getUser()?.roleName ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(roleName: string): boolean {
    return this.getUser()?.roleName?.trim().toLowerCase()
      === roleName.trim().toLowerCase();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }
}
