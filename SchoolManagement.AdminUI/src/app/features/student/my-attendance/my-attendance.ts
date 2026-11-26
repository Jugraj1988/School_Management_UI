
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AttendanceService } from '../../../core/services/attendance-service';

@Component({
  selector: 'app-my-attendance',
  standalone: false,
  styleUrl: './my-attendance.css',
  templateUrl: './my-attendance.html',
})
export class MyAttendance implements OnInit {

  attendanceRecords: any[] = [];

  fromDate = '';
  toDate = '';

  loading = false;
  errorMessage = '';

  constructor(private attendanceService: AttendanceService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Set default date range to the current month
    const today = new Date();

    this.fromDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).toISOString().split('T')[0];

    this.toDate = today.toISOString().split('T')[0];

    this.loadAttendance();
  }

  loadAttendance(): void {

    if (!this.fromDate || !this.toDate) {
      this.errorMessage = 'Please select both dates.';
      return;
    }

    if (this.fromDate > this.toDate) {
      this.errorMessage = 'From date cannot be greater than To date.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.attendanceService
      .getMyAttendance(this.fromDate, this.toDate)
      .subscribe({
        next: (response: any) => {
          this.attendanceRecords = response.data || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Attendance error:', error);
          this.errorMessage =
            error.error?.message ||
            error.error?.message ||
            'Unable to load attendance.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

}
