
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'https://localhost:7148/api/Attendance';

  constructor(private http: HttpClient) {}

  markClassAttendance(request: {
    schoolClassId: number;
    academicYearId: number;
    date: string;
    students: {
      enrollmentId: number;
      isPresent: boolean;
    }[];
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-class`, request);
  }

  getClassAttendance(
  classId: number,
  academicYearId: number,
  date: string
): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/class/${classId}`,
    {
      params: {
        academicYearId: academicYearId.toString(),
        date: date
      }
    }
  );

  
}

getClassAttendanceHistory(
  classId: number,
  fromDate: string,
  toDate: string
): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/history/${classId}`,
    {
      params: { fromDate, toDate }
    }
  );
}

getStudentAttendanceHistory(
  studentId: number,
  fromDate: string,
  toDate: string
): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/student/${studentId}`,
    {
      params: { fromDate, toDate }
    }
  );
}

getClassAttendanceReport(
  classId: number,
  fromDate: string,
  toDate: string
): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/report/${classId}`,
    {
      params: { fromDate, toDate }
    }
  );
  
}

getMyAttendance(fromDate: string, toDate: string): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/my-attendance`,
    {
      params: { fromDate, toDate }
    }
  );
}
}
