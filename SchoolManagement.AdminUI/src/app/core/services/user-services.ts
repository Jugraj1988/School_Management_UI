import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../enviroments/enviroment';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  isActive: boolean;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(`${this.apiUrl}/users`)
      .pipe(map(response => response.data));
  }

  getUserById(userId: number): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.apiUrl}/by/${userId}`)
      .pipe(map(response => response.data));
  }

  activateUser(userId: number): Observable<User> {
    return this.http
      .patch<ApiResponse<User>>(
        `${this.apiUrl}/activate/${userId}`,
        {}
      )
      .pipe(map(response => response.data));
  }

  deactivateUser(userId: number): Observable<User> {
    return this.http
      .patch<ApiResponse<User>>(
        `${this.apiUrl}/deactivate/${userId}`,
        {}
      )
      .pipe(map(response => response.data));
  }
}
