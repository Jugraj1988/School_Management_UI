
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolClassService {

  private apiUrl = 'https://localhost:7148/api/SchoolClass';

  constructor(private http: HttpClient) {}

  getAllClasses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/classes`);
  }

  
}
