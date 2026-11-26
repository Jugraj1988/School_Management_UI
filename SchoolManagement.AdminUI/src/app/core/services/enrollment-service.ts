
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private apiUrl = 'https://localhost:7148/api/enrollment';

  constructor(private http: HttpClient) {}

  getByClass(classId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/byClass/${classId}`);
  }

  getMyEnrollments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-enrollments`);
  }
}
