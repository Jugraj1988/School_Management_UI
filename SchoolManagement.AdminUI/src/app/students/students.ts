
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { StudentService } from '../core/services/student-services';
import { SchoolClassService } from '../core/services/school-class';
import { AcademicYearService } from '../core/services/acadmicYearService';

@Component({
  selector: 'app-students',
  standalone: false,
  styleUrl: './students.css',
  templateUrl: './students.html',
})
export class Students implements OnInit {

  students: any[] = [];
  filteredStudents: any[] = [];

  classes: any[] = [];
  academicYears: any[] = [];

  genders: string[] = ['Male', 'Female', 'Other'];

  studentForm!: FormGroup;

  loading = false;
  saving = false;

  showForm = false;
  isEditMode = false;

  selectedStudentId: number | null = null;

  searchText = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private schoolClassService: SchoolClassService,
    private academicYearService: AcademicYearService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadStudents();
    this.loadClasses();
    this.loadAcademicYears();
  }

  // Initialize Student Form
  initializeForm(): void {
    this.studentForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]{2,}(?: [A-Za-z]{2,})+$/)
      ]],

      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]],

      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[9876]\d{9,11}$/)
      ]],

      dateOfBirth: ['', [
        Validators.required
      ]],

      gender: ['', [
        Validators.required
      ]],

      address: ['', [
        Validators.maxLength(100)
      ]],

      schoolClassId: [null, [
        Validators.required
      ]],

      academicYearId: [null, [
        Validators.required
      ]],

      password: ['', [
        Validators.required,
        Validators.maxLength(12)
      ]]
    });
  }

  // Load School Classes
  loadClasses(): void {
    this.schoolClassService.getAllClasses().subscribe({
      next: (response: any) => {
        this.classes = response.data ?? [];
        this.cdr.detectChanges();
      },
      error: (error) => {
          this.errorMessage =
              error.error?.Message ||
              error.error?.message ||
              error.message || 'Unable to load classes.';
      }
    });
  }

  // Load Active Academic Years
  loadAcademicYears(): void {
    this.academicYearService.getAllAcademicYears().subscribe({
      next: (response: any) => {
        this.academicYears = (response.data ?? [])
          .filter((year: any) => year.isActive);

        this.cdr.detectChanges();
      },
      error: (error) => {
         this.errorMessage =
              error.error?.Message ||
              error.error?.message ||
              error.message || 'Unable to load academic years.';
      }
    });
  }

  // Get All Students
  loadStudents(): void {
    this.loading = true;
    this.errorMessage = '';

    this.studentService.getAllStudents()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          this.students = response.data ?? [];
          this.searchStudents();

          console.log('Students count:', this.students.length);
        },
        error: (error: any) => {
          console.error(error);
            this.errorMessage =
              error.error?.Message ||
              error.error?.message ||
              error.message || 'Unable to load students.';
        }
      });
  }

  // Search Students
  searchStudents(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredStudents = this.students.filter(student =>
      student.fullName?.toLowerCase().includes(search) ||
      student.email?.toLowerCase().includes(search) ||
      student.phoneNumber?.includes(search)
    );
  }

  // Open Add Student Form
  openAddForm(): void {
    this.isEditMode = false;
    this.selectedStudentId = null;

    this.studentForm.reset();

    this.studentForm.get('password')?.setValidators([
      Validators.required,
      Validators.maxLength(12)
    ]);

    this.studentForm.get('password')?.updateValueAndValidity();

    this.studentForm.get('fullName')?.setValidators([
      Validators.required,
      Validators.pattern(/^[A-Za-z]{2,}(?: [A-Za-z]{2,})+$/)
    ]);

    this.studentForm.get('phoneNumber')?.setValidators([
      Validators.required,
      Validators.pattern(/^[9876]\d{9,11}$/)
    ]);

    this.studentForm.updateValueAndValidity();

    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Open Edit Student Form
  editStudent(student: any): void {
    this.isEditMode = true;
    this.selectedStudentId = student.studentId;

    this.studentForm.reset();

    this.studentForm.patchValue({
      fullName: student.fullName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      dateOfBirth: student.dateOfBirth
        ? student.dateOfBirth.substring(0, 10)
        : '',
      gender: student.gender,
      address: student.address,
      schoolClassId: student.schoolClassId,
      academicYearId: student.academicYearId,
      password: ''
    });

    // Password is not required while updating
    this.studentForm.get('password')?.clearValidators();
    this.studentForm.get('password')?.updateValueAndValidity();

    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Save Student (Create / Update)
  saveStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.studentForm.value;

    if (this.isEditMode && this.selectedStudentId !== null) {

      const request = {
        fullName: formValue.fullName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        dateOfBirth: formValue.dateOfBirth,
        gender: formValue.gender,
        address: formValue.address,
        updatedAt: new Date().toISOString()
      };

      this.studentService.updateStudent(
        this.selectedStudentId,
        request
      )
        .pipe(
          finalize(() => {
            this.saving = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: () => {
            this.successMessage = 'Student updated successfully.';
            this.finishSave();
          },
          error: (error: any) => {
            console.error(error);
            this.errorMessage =
              error.error?.Message ||
              error.error?.message ||
              error.message || 'Unable to update student.';
          }
        });

    } else {

      const request = {
        fullName: formValue.fullName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        dateOfBirth: formValue.dateOfBirth,
        gender: formValue.gender,
        address: formValue.address,
        password: formValue.password,
        schoolClassId: Number(formValue.schoolClassId),
        academicYearId: Number(formValue.academicYearId)
      };

      this.studentService.createStudent(request)
        .pipe(
          finalize(() => {
            this.saving = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: () => {
            this.successMessage = 'Student created successfully.';
            this.finishSave();
          },
          error: (error: any) => {
            console.error(error);

            this.errorMessage =
              error.error?.Message ||
              error.error?.message ||
              error.message ||
              'Unable to create student.';
          }
        });
    }
  }

  // After Successful Save
  finishSave(): void {
    this.showForm = false;
    this.studentForm.reset();
    this.loadStudents();
     this.cdr.detectChanges();
  }

  // Activate Student
  activateStudent(studentId: number): void {
    if (!confirm('Are you sure you want to activate this student?')) {
      return;
    }

    this.studentService.activateStudent(studentId).subscribe({
      next: () => {
        this.successMessage = 'Student activated successfully.';
        this.loadStudents();
      },
      error: (error: any) => {
        console.error(error);
          this.errorMessage =
              error.error?.Message ||
              error.error?.message ||
              error.message || 'Unable to activate student.';
               this.cdr.detectChanges();
      }
    });
  }

  // Deactivate Student
  deactivateStudent(studentId: number): void {
    if (!confirm('Are you sure you want to deactivate this student?')) {
      return;
    }

    this.studentService.deactivateStudent(studentId).subscribe({
      next: () => {
        this.successMessage = 'Student deactivated successfully.';
        this.loadStudents();
      },
      error: (error: any) => {
        console.error(error);
        this.errorMessage =
          error.error?.Message ||
          error.error?.message ||
          error.message || 'Unable to deactivate student.';
           this.cdr.detectChanges();
      }
      
    });
  }

  // Close Form
  closeForm(): void {
    this.showForm = false;
    this.studentForm.reset();
    this.errorMessage = '';
  }

  // Form Validation Helper
  get f() {
    return this.studentForm.controls;
  }
}
