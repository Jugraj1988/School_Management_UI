
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private apiUrl = 'https://localhost:7148/api/Teacher';

  constructor(private http: HttpClient) {}

  // Create Teacher
  createTeacher(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Create-teacher`, request);
  }

  // Get All Teachers
  getAllTeachers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-teachers`);
  }

  // Get Teacher By ID
  getTeacherById(teacherId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/by/${teacherId}`);
  }

  // Update Teacher
  updateTeacher(teacherId: number, request: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateBy/${teacherId}`, request);
  }

  // Activate Teacher
  activateTeacher(teacherId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/activate/${teacherId}`, {});
  }

  // Deactivate Teacher
  deactivateTeacher(teacherId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/deactivate/${teacherId}`, {});
  }
}
