
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

// School information returned by the API
export interface School {
  schoolId: number;
  name: string;
  address: string;
  phone: string;
  isActive?: boolean;
}

// Request model for creating a school
export interface SchoolRequest {
  name: string;
  address: string;
  phone: string;
  fullName: string;
  email: string;
  password: string;
}

// Request model for updating a school
export interface UpdateSchoolRequest {
  schoolId: number;
  name: string;
  address: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchoolsService {

  private readonly apiUrl = `${environment.apiUrl}/School`;

  constructor(private http: HttpClient) {}

  // Get all schools
  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(
      `${this.apiUrl}/all-school`
    );
  }

  // Get a school by ID
  getSchoolById(schoolId: number): Observable<School> {
    return this.http.get<School>(
      `${this.apiUrl}/byschool/${schoolId}`
    );
  }

  // Add a new school
  addSchool(request: SchoolRequest): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/add-school`,
      request
    );
  }

  // Update an existing school
  updateSchool(
    request: UpdateSchoolRequest
  ): Observable<unknown> {
    return this.http.put(
      `${this.apiUrl}/update-school`,
      request
    );
  }

  // Activate a school
  activateSchool(schoolId: number): Observable<unknown> {
    return this.http.patch(
      `${this.apiUrl}/activate-school/${schoolId}`,
      {}
    );
  }

  // Deactivate a school
  deactivateSchool(schoolId: number): Observable<unknown> {
    return this.http.patch(
      `${this.apiUrl}/deactivate-school/${schoolId}`,
      {}
    );
  }
}
