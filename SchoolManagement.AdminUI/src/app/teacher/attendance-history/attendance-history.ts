
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TeacherClassService } from '../../core/services/teacher-class-service';
import { AttendanceService } from '../../core/services/attendance-service';

@Component({
  selector: 'app-attendance-history',
  standalone: false,
  templateUrl: './attendance-history.html',
  styleUrls: ['./attendance-history.css']
})
export class AttendanceHistory implements OnInit {

  assignedClasses: any[] = [];

  attendanceHistory: any[] = [];
  studentHistory: any[] = [];
  studentReports: any[] = [];

  selectedClassId: number | null = null;
  selectedStudentId: number | null = null;

  fromDate: string = this.getFirstDayOfMonth();
  toDate: string = this.getTodayDate();

  classReport: any = null;

  loadingClasses = false;
  loadingReport = false;
  loadingHistory = false;
  loadingStudentHistory = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private teacherClassService: TeacherClassService,
    private attendanceService: AttendanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAssignedClasses();
  }

  private getTodayDate(): string {
    return new Date().toLocaleDateString('en-CA');
  }

  private getFirstDayOfMonth(): string {
    const date = new Date();
    date.setDate(1);
    return date.toLocaleDateString('en-CA');
  }

  loadAssignedClasses(): void {
    this.loadingClasses = true;
    this.errorMessage = '';

    this.teacherClassService.getMyClasses().subscribe({
      next: (response: any) => {

        this.assignedClasses =
          response?.data ?? response?.Data ?? response ?? [];

        if (this.assignedClasses.length > 0) {
          this.selectedClassId =
            Number(this.assignedClasses[0].schoolClassId ??
                   this.assignedClasses[0].SchoolClassId);

          this.loadAttendanceData();
        }

        this.loadingClasses = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading classes:', error);

        this.errorMessage = 'Unable to load assigned classes.';
        this.loadingClasses = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFilterChange(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.attendanceHistory = [];
    this.studentHistory = [];
    this.studentReports = [];
    this.classReport = null;
    this.selectedStudentId = null;

    if (!this.selectedClassId || !this.fromDate || !this.toDate) {
      return;
    }

    if (this.fromDate > this.toDate) {
      this.errorMessage =
        'From Date cannot be greater than To Date.';
      return;
    }

    this.loadAttendanceData();
  }

  loadAttendanceData(): void {
    if (!this.selectedClassId) {
      return;
    }

    this.loadClassHistory();
    this.loadClassReport();
  }

  loadClassHistory(): void {
    this.loadingHistory = true;

    this.attendanceService.getClassAttendanceHistory(
      Number(this.selectedClassId),
      this.fromDate,
      this.toDate
    ).subscribe({
      next: (response: any) => {

        this.attendanceHistory =
          response?.data ?? response?.Data ?? response ?? [];

        this.loadingHistory = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading attendance history:', error);

        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to load attendance history.';

        this.loadingHistory = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadClassReport(): void {
    this.loadingReport = true;

    this.attendanceService.getClassAttendanceReport(
      Number(this.selectedClassId),
      this.fromDate,
      this.toDate
    ).subscribe({
      next: (response: any) => {

        this.classReport =
          response?.data ?? response?.Data ?? response ?? null;

        this.studentReports =
          this.classReport?.students ??
          this.classReport?.Students ?? [];

        this.loadingReport = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading class report:', error);

        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to load attendance report.';

        this.loadingReport = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewStudentHistory(student: any): void {
    const studentId = Number(
      student.studentId ?? student.StudentId
    );

    if (!studentId) {
      this.errorMessage = 'Invalid student ID.';
      return;
    }

    this.selectedStudentId = studentId;
    this.loadingStudentHistory = true;
    this.studentHistory = [];

    this.attendanceService.getStudentAttendanceHistory(
      studentId,
      this.fromDate,
      this.toDate
    ).subscribe({
      next: (response: any) => {

        this.studentHistory =
          response?.data ?? response?.Data ?? response ?? [];

        this.loadingStudentHistory = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading student history:', error);

        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to load student attendance history.';

        this.loadingStudentHistory = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeStudentHistory(): void {
    this.selectedStudentId = null;
    this.studentHistory = [];
  }

  get selectedStudentName(): string {
    const student = this.studentReports.find(
      s => Number(s.studentId ?? s.StudentId) === this.selectedStudentId
    );

    return student?.studentName ??
           student?.StudentName ??
           'Student';
  }

  get totalStudents(): number {
    return this.classReport?.totalStudents ??
           this.classReport?.TotalStudents ?? 0;
  }

  get totalPresent(): number {
    return this.classReport?.totalPresent ??
           this.classReport?.TotalPresent ?? 0;
  }

  get totalAbsent(): number {
    return this.classReport?.totalAbsent ??
           this.classReport?.TotalAbsent ?? 0;
  }

  get attendancePercentage(): number {
    return this.classReport?.attendancePercentage ??
           this.classReport?.AttendancePercentage ?? 0;
  }

  getStudentName(student: any): string {
    return student.studentName ?? student.StudentName ?? 'Unknown';
  }

  getStudentPercentage(student: any): number {
    return student.attendancePercentage ??
           student.AttendancePercentage ?? 0;
  }

  getPresentDays(student: any): number {
    return student.presentDays ?? student.PresentDays ?? 0;
  }

  getAbsentDays(student: any): number {
    return student.absentDays ?? student.AbsentDays ?? 0;
  }

  getHistoryStudentName(record: any): string {
    return record.studentName ?? record.StudentName ?? 'Unknown';
  }

  getHistoryDate(record: any): string {
    return record.date ?? record.Date ?? '';
  }

  isPresent(record: any): boolean {
    return record.isPresent ?? record.IsPresent ?? false;
  }

  getClassName(classItem: any): string {
    const grade = classItem.grade ?? classItem.Grade ?? '';
    const section = classItem.section ?? classItem.Section ?? '';

    return section ? `${grade} - ${section}` : grade;
  }
}
