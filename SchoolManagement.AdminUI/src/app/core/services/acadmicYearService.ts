import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearService {

  private apiUrl = 'https://localhost:7148/api/AcademicYear';

  constructor(private http: HttpClient) {}

  getAllAcademicYears(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }
}
