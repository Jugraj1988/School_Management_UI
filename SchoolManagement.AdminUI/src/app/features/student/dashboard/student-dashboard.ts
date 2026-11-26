
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EnrollmentService } from '../../../core/services/enrollment-service';
import { AttendanceService } from '../../../core/services/attendance-service';

@Component({
  selector: 'student-dashboard',
  standalone: false,
  styleUrl: './student-dashboard.css',
  templateUrl: './student-dashboard.html',
})
export class StudentDashboard implements OnInit {

  // Enrollment Properties
  enrollments: any[] = [];
  loading = false;
  errorMessage = '';

  // Attendance Properties
  attendanceRecords: any[] = [];
  attendanceLoading = false;
  attendanceError = '';

  constructor(
    private enrollmentService: EnrollmentService,
    private attendanceService: AttendanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyEnrollments();
    this.loadAttendanceSummary();
  }

  // Load Student Enrollments
  loadMyEnrollments(): void {

    this.loading = true;
    this.errorMessage = '';

    this.enrollmentService.getMyEnrollments().subscribe({

      next: (response: any) => {

        this.enrollments = response.data || [];
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Enrollment error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load your enrollments.';

        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  // Load Current Month Attendance
  loadAttendanceSummary(): void {

    const today = new Date();

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const fromDate = this.formatDate(firstDay);
    const toDate = this.formatDate(today);

    this.attendanceLoading = true;
    this.attendanceError = '';

    this.attendanceService.getMyAttendance(fromDate, toDate).subscribe({

      next: (response: any) => {

        this.attendanceRecords = response.data || [];
        this.attendanceLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Attendance error:', error);

        this.attendanceError =
          error.error?.message || 'Unable to load attendance summary.';

        this.attendanceLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  // Format Date as yyyy-MM-dd
  private formatDate(date: Date): string {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Attendance Summary Calculations

  get totalAttendance(): number {
    return this.attendanceRecords.length;
  }

  get presentCount(): number {
    return this.attendanceRecords.filter(
      attendance => attendance.isPresent
    ).length;
  }

  get absentCount(): number {
    return this.attendanceRecords.filter(
      attendance => !attendance.isPresent
    ).length;
  }

  get attendancePercentage(): number {

    if (this.totalAttendance === 0) {
      return 0;
    }

    return Math.round(
      (this.presentCount / this.totalAttendance) * 100
    );
  }
}
