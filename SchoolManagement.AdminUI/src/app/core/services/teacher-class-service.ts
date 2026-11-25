import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherClassService {

  private apiUrl = 'https://localhost:7148/api/TeacherClass';

  constructor(private http: HttpClient) {}

  // Assign multiple classes to a teacher
  assignClasses(request: {
    teacherId: number;
    schoolClassIds: number[];
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, request);
  }

  // Get assigned classes of a particular teacher
  getTeacherClasses(teacherId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/${teacherId}`);
  }

  // Remove a teacher-class assignment
  removeAssignment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${id}`);
  }

  getMyClasses(): Observable<any> {
  return this.http.get(`${this.apiUrl}/my-classes`);
}
}