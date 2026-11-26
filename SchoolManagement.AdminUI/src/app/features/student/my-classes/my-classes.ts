
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EnrollmentService } from '../../../core/services/enrollment-service';

@Component({
  selector: 'app-my-classes',
  standalone: false,
  templateUrl: './my-classes.html',
  styleUrl: './my-classes.css'
})
export class StudentClasses implements OnInit {

  enrollments: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private enrollmentService: EnrollmentService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMyClasses();
  }

  loadMyClasses(): void {
    this.loading = true;
    this.errorMessage = '';

    this.enrollmentService.getMyEnrollments().subscribe({
      next: (response) => {
        this.enrollments = response.data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =``
          error.error?.message ||
          error.error?.Message ||
          'Unable to load your classes.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
