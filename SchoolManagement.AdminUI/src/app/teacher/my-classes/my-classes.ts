
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TeacherClassService } from '../../core/services/teacher-class-service';

@Component({
  selector: 'app-my-classes',
  standalone: false,
  templateUrl: './my-classes.html',
  styleUrls: ['./my-classes.css']
})
export class MyClasses implements OnInit {

  classes: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private teacherClassService: TeacherClassService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyClasses();
  }

  loadMyClasses(): void {
    this.loading = true;
    this.errorMessage = '';

    this.teacherClassService.getMyClasses().subscribe({
      next: (response) => {
        this.classes = response.data ?? response ?? [];
        this.loading = false;
        this.cdr.detectChanges();

        console.log('My assigned classes:', this.classes);
      },
      error: (error) => {
        console.error('Unable to load my classes:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load your classes.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
