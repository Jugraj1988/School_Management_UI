
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StudentService } from '../../../core/services/student-services';

@Component({
  selector: 'app-my-students',
  standalone: false,
  templateUrl: './teacher-students.html',
  styleUrls: ['./teacher-students.css']
})
export class TeacherStudents implements OnInit {

  students: any[] = [];
  filteredStudents: any[] = [];

  loading = false;
  errorMessage = '';
  searchText = '';

  constructor(
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyStudents();
  }

  loadMyStudents(): void {
    this.loading = true;
    this.errorMessage = '';

    this.studentService.getAllStudents().subscribe({
      next: (response: any) => {
        this.students = response.data ?? response ?? [];
        this.filteredStudents = [...this.students];

        this.loading = false;
        this.cdr.detectChanges();

        console.log('My Students:', this.students);
      },
      error: (error: any) => {
        console.error('Unable to load students:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load students.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchStudents(): void {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredStudents = [...this.students];
      return;
    }

    this.filteredStudents = this.students.filter(student => {
      const name = this.getStudentName(student).toLowerCase();
      const email = (student.email ?? student.user?.email ?? '').toLowerCase();

      return name.includes(search) || email.includes(search);
    });
  }

  getStudentName(student: any): string {
    if (student.fullName) return student.fullName;
    if (student.studentName) return student.studentName;

    const firstName = student.user?.firstName ?? student.firstName ?? '';
    const lastName = student.user?.lastName ?? student.lastName ?? '';

    return `${firstName} ${lastName}`.trim() || 'N/A';
  }

  getStudentEmail(student: any): string {
    return student.email ?? student.user?.email ?? 'N/A';
  }

  getStudentPhone(student: any): string {
    return student.phoneNumber ??
           student.phone ??
           student.user?.phoneNumber ??
           'N/A';
  }
}
