
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../core/services/teacher-services';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-teachers',
  standalone: false,
  templateUrl: './teachers.html',
  styleUrls: ['./teachers.css']
})
export class Teachers implements OnInit {

  teachers: any[] = [];
  filteredTeachers: any[] = [];

  teacherForm!: FormGroup;

  loading = false;
  saving = false;

  showForm = false;
  isEditMode = false;

  selectedTeacherId: number | null = null;

  searchText = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
     private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.loadTeachers();
  }

  // Initialize Reactive Form
  initializeForm(): void {
    this.teacherForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)
      ]],

      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]],

      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d{10,12}$/)
      ]],

      address: ['', [
        Validators.maxLength(100)
      ]],

      password: ['', [
        Validators.required,
        Validators.maxLength(12)
      ]],

      qualification: ['']
    });
  }

  // Get All Teachers
 loadTeachers(): void {

  this.loading = true;
  this.errorMessage = '';

  this.cdr.detectChanges();

  this.teacherService.getAllTeachers()
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (response) => {

        this.teachers = response.data ?? [];
        this.filteredTeachers = [...this.teachers];

        this.cdr.detectChanges();

        console.log('Teachers count:', this.teachers.length);
      },

      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load teachers.';

        this.cdr.detectChanges();
      }
    });
}

  // Search Teachers
  searchTeachers(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredTeachers = this.teachers.filter(teacher =>
      teacher.fullName?.toLowerCase().includes(search) ||
      teacher.email?.toLowerCase().includes(search) ||
      teacher.phoneNumber?.includes(search)
    );
  }

  // Open Add Teacher Form
  openAddForm(): void {
    this.isEditMode = false;
    this.selectedTeacherId = null;
    this.teacherForm.reset();

    this.teacherForm.get('password')?.setValidators([
      Validators.required,
      Validators.maxLength(12)
    ]);

    this.teacherForm.get('password')?.updateValueAndValidity();

    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Open Edit Teacher Form
  editTeacher(teacher: any): void {
    this.isEditMode = true;
    this.selectedTeacherId = teacher.teacherId;

    this.teacherForm.patchValue({
      fullName: teacher.fullName,
      email: teacher.email,
      phoneNumber: teacher.phoneNumber,
      address: teacher.address,
      qualification: teacher.qualification,
      password: ''
    });

    // Password is not required when updating
    this.teacherForm.get('password')?.clearValidators();
    this.teacherForm.get('password')?.updateValueAndValidity();

    // Apply Update DTO phone validation
    this.teacherForm.get('phoneNumber')?.setValidators([
      Validators.required,
      Validators.pattern(/^[9876]\d{9,11}$/)
    ]);

    // Apply Update DTO full name validation
    this.teacherForm.get('fullName')?.setValidators([
      Validators.required,
      Validators.pattern(/^[A-Za-z]{2,}(?: [A-Za-z]{2,})+$/)
    ]);

    this.teacherForm.get('fullName')?.updateValueAndValidity();
    this.teacherForm.get('phoneNumber')?.updateValueAndValidity();

    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Save Teacher (Add / Update)
  saveTeacher(): void {
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.teacherForm.value;

    if (this.isEditMode && this.selectedTeacherId !== null) {

      const request = {
        fullName: formValue.fullName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        address: formValue.address,
        qualification: formValue.qualification,
        updatedAt: new Date().toISOString()
      };

      this.teacherService.updateTeacher(
        this.selectedTeacherId,
        request
      ).subscribe({
        next: () => {
          this.successMessage = 'Teacher updated successfully.';
          this.finishSave();
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = error.error?.message || 'Unable to update teacher.';
          this.saving = false;
        }
      });

    } else {

      const request = {
        fullName: formValue.fullName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        address: formValue.address,
        password: formValue.password,
        qualification: formValue.qualification
      };

      this.teacherService.createTeacher(request).subscribe({
        next: () => {
          this.successMessage = 'Teacher created successfully.';
          this.finishSave();
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = error.error?.message || 'Unable to create teacher.';
          this.saving = false;
        }
      });
    }
  }

  // After Successful Save
  finishSave(): void {
    this.showForm = false;
    this.saving = false;
    this.loadTeachers();
  }

  // Activate Teacher
  activateTeacher(teacherId: number): void {
    if (!confirm('Are you sure you want to activate this teacher?')) {
      return;
    }

    this.teacherService.activateTeacher(teacherId).subscribe({
      next: () => {
        this.successMessage = 'Teacher activated successfully.';
        this.loadTeachers();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to activate teacher.';
      }
    });
  }

  // Deactivate Teacher
  deactivateTeacher(teacherId: number): void {
    if (!confirm('Are you sure you want to deactivate this teacher?')) {
      return;
    }

    this.teacherService.deactivateTeacher(teacherId).subscribe({
      next: () => {
        this.successMessage = 'Teacher deactivated successfully.';
        this.loadTeachers();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to deactivate teacher.';
      }
    });
  }

  // Close Form
  closeForm(): void {
    this.showForm = false;
    this.teacherForm.reset();
    this.errorMessage = '';
  }

  // Form Validation Helper
  get f() {
    return this.teacherForm.controls;
  }
}
