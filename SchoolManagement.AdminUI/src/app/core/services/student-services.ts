
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = 'https://localhost:7148/api/Student';

  constructor(private http: HttpClient) {}

  // Create Student
  createStudent(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Create-student`, request);
  }

  // Get All Students   
  getAllStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-students`);
  }

  // Get Student By ID
  getStudentById(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/by/${studentId}`);
  }

  // Update Student
  updateStudent(studentId: number, request: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateBy/${studentId}`, request);
  }

  // Activate Student
  activateStudent(studentId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/activate/${studentId}`, {});
  }

  // Deactivate Student
  deactivateStudent(studentId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/deactivate/${studentId}`, {});
  }
}
