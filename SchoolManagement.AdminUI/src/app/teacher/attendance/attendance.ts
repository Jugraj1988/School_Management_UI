
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TeacherClassService } from '../../core/services/teacher-class-service';
import { AttendanceService } from '../../core/services/attendance-service';
import { EnrollmentService } from '../../core/services/enrollment-service';

@Component({
  selector: 'app-attendance',
  standalone: false,
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class Attendance implements OnInit {

  assignedClasses: any[] = [];
  enrollments: any[] = [];
  academicYears: any[] = [];
  students: any[] = [];

  selectedClassId: number | null = null;
  selectedAcademicYearId: number | null = null;

  attendanceDate = this.getTodayDate();

  loadingClasses = false;
  loadingStudents = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private teacherClassService: TeacherClassService,
    private enrollmentService: EnrollmentService,
    private attendanceService: AttendanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAssignedClasses();
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  loadAssignedClasses(): void {
    this.loadingClasses = true;
    this.errorMessage = '';

    this.teacherClassService.getMyClasses().subscribe({
      next: (response: any) => {
        this.assignedClasses = response.data ?? response ?? [];
        this.loadingClasses = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Unable to load assigned classes:', error);
        this.errorMessage = 'Unable to load your assigned classes.';
        this.loadingClasses = false;
        this.cdr.detectChanges();
      }
    });
  }

  onClassChange(): void {
    this.enrollments = [];
    this.academicYears = [];
    this.students = [];
    this.selectedAcademicYearId = null;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.selectedClassId) {
      return;
    }

    this.loadEnrollments();
  }

  loadEnrollments(): void {
    if (!this.selectedClassId) {
      return;
    }

    this.loadingStudents = true;

    this.enrollmentService.getByClass(this.selectedClassId).subscribe({
      next: (response: any) => {
        this.enrollments = response.data ?? response ?? [];

        this.enrollments = this.enrollments.filter(
          enrollment => enrollment.isActive
        );

        const yearMap = new Map<number, any>();

        this.enrollments.forEach(enrollment => {
          yearMap.set(enrollment.academicYearId, {
            academicYearId: enrollment.academicYearId,
            academicYearName: enrollment.academicYearName
          });
        });

        this.academicYears = Array.from(yearMap.values());

        this.loadingStudents = false;

        if (this.academicYears.length > 0) {
          this.selectedAcademicYearId =
            this.academicYears[0].academicYearId;

          this.onAcademicYearChange();
        } else {
          this.students = [];
        }

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Unable to load enrollments:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load class students.';

        this.loadingStudents = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAcademicYearChange(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.students = [];

    if (!this.selectedAcademicYearId) {
      return;
    }

    this.loadClassAttendance();
  }

  // Called whenever the attendance date changes.
  onDateChange(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.selectedClassId && this.selectedAcademicYearId) {
      this.loadClassAttendance();
    }
  }

  // Load students and their saved attendance for the selected date.
  loadClassAttendance(): void {
    if (!this.selectedClassId || !this.selectedAcademicYearId ||
        !this.attendanceDate) {
      return;
    }

    this.loadingStudents = true;
    this.students = [];

    this.attendanceService.getClassAttendance(
      Number(this.selectedClassId),
      Number(this.selectedAcademicYearId),
      this.attendanceDate
    ).subscribe({
      next: (response: any) => {
        const data = response.data ?? response.Data;

        this.students = (data?.students ?? data?.Students ?? []).map(
          (student: any) => ({
            enrollmentId: student.enrollmentId ?? student.EnrollmentId,
            studentName: student.studentName ?? student.StudentName,
            isPresent: student.isPresent ?? student.IsPresent ?? false,
            isMarked: student.isMarked ?? student.IsMarked ?? false,
            isEditing: false
          })
        );

        this.loadingStudents = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Unable to load attendance:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load attendance records.';

        this.loadingStudents = false;
        this.cdr.detectChanges();
      }
    });
  }

  markAll(isPresent: boolean): void {
    this.students.forEach(student => {
      student.isPresent = isPresent;
      student.isEditing = true;
    });
  }

  editAttendance(student: any): void {
    student.isEditing = true;
  }

  get presentCount(): number {
    return this.students.filter(
      student => student.isMarked && student.isPresent
    ).length;
  }

  get absentCount(): number {
    return this.students.filter(
      student => student.isMarked && !student.isPresent
    ).length;
  }

  get unmarkedCount(): number {
    return this.students.filter(
      student => !student.isMarked
    ).length;
  }

  saveAttendance(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedClassId || !this.selectedAcademicYearId) {
      this.errorMessage = 'Please select a class and academic year.';
      return;
    }

    if (!this.attendanceDate) {
      this.errorMessage = 'Please select an attendance date.';
      return;
    }

    if (this.students.length === 0) {
      this.errorMessage = 'No students available for attendance.';
      return;
    }

    const request = {
      schoolClassId: Number(this.selectedClassId),
      academicYearId: Number(this.selectedAcademicYearId),
      date: this.attendanceDate,
      students: this.students.map(student => ({
        enrollmentId: student.enrollmentId,
        isPresent: student.isPresent
      }))
    };

    this.saving = true;

    this.attendanceService.markClassAttendance(request).subscribe({
      next: (response: any) => {
        this.successMessage =
          response.message || 'Attendance saved successfully.';

        // All students included in the request are now marked.
        this.students.forEach(student => {
          student.isMarked = true;
          student.isEditing = false;
        });

        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Unable to save attendance:', error);

        this.errorMessage =
          error.error?.message || 'Unable to save attendance.';

        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
