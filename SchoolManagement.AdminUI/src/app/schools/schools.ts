
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { NgForm } from '@angular/forms';

import {
  SchoolsService,
  School,
  SchoolRequest,
  UpdateSchoolRequest
} from '../core/services/school';

@Component({
  selector: 'app-schools',
  standalone: false,
  templateUrl: './schools.html',
  styleUrl: './schools.css'
})
export class Schools implements OnInit {

  // School data
  schools: School[] = [];
  filteredSchools: School[] = [];

  // Search
  searchText = '';

  // Loading and form states
  loading = false;
  saving = false;
  showAddForm = false;
  isEditMode = false;
  editingSchoolId: number | null = null;

  // Messages
  errorMessage = '';
  successMessage = '';

  // Tracks the school whose status is changing
  changingStatusSchoolId: number | null = null;

  // Add/Edit form model
  newSchool: SchoolRequest = this.createEmptySchool();

  constructor(
    private schoolsService: SchoolsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSchools();
  }

  // Create an empty school form model
  private createEmptySchool(): SchoolRequest {
    return {
      name: '',
      address: '',
      phone: '',
      fullName: '',
      email: '',
      password: ''
    };
  }

  // Load all schools
  loadSchools(): void {
    this.loading = true;
    this.errorMessage = '';

    this.schoolsService.getAllSchools().subscribe({
      next: (response: School[]) => {
        this.schools = Array.isArray(response) ? response : [];

        this.searchSchools();

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load schools:', error);

        this.loading = false;
        this.errorMessage = this.getActionErrorMessage(
          error,
          'view'
        );

        this.cdr.detectChanges();
      }
    });
  }

  // Search by school name, address, or phone
  searchSchools(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredSchools = this.schools.filter(school =>
      (school.name ?? '').toLowerCase().includes(search) ||
      (school.address ?? '').toLowerCase().includes(search) ||
      (school.phone ?? '').toLowerCase().includes(search)
    );
  }

  // Clear search
  clearSearch(): void {
    this.searchText = '';
    this.searchSchools();
  }

  // Open Add School form
  openAddForm(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.isEditMode = false;
    this.editingSchoolId = null;

    this.resetForm();
    this.showAddForm = true;
  }

  // Open Edit School form
  openEditForm(school: School): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.isEditMode = true;
    this.editingSchoolId = school.schoolId;

    this.newSchool = {
      name: school.name ?? '',
      address: school.address ?? '',
      phone: school.phone ?? '',
      fullName: '',
      email: '',
      password: ''
    };

    this.showAddForm = true;
  }

  // Cancel Add/Edit form
  cancelAdd(): void {
    this.showAddForm = false;
    this.isEditMode = false;
    this.editingSchoolId = null;

    this.errorMessage = '';
    this.resetForm();
  }

  // Reset form
  resetForm(): void {
    this.newSchool = this.createEmptySchool();
  }

  // Save new school or update existing school
  saveSchool(form: NgForm): void {
    if (form.invalid || this.saving) {
      form.control.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.saving = true;

    // Update existing school
    if (this.isEditMode) {
      this.updateExistingSchool();
      return;
    }

    // Add new school
    this.addNewSchool();
  }

  // Add school
  private addNewSchool(): void {
    const request: SchoolRequest = {
      ...this.newSchool,
      name: this.newSchool.name.trim(),
      address: this.newSchool.address.trim(),
      phone: this.newSchool.phone.trim(),
      fullName: this.newSchool.fullName.trim(),
      email: this.newSchool.email.trim()
    };

    this.schoolsService.addSchool(request).subscribe({
      next: () => {
        this.saving = false;
        this.showAddForm = false;
        this.isEditMode = false;
        this.editingSchoolId = null;

        this.resetForm();
        this.searchText = '';

        this.successMessage = 'School added successfully!';

        this.loadSchools();
      },

      error: (error) => {
        console.error('Failed to add school:', error);

        this.saving = false;
        this.errorMessage = this.getActionErrorMessage(
          error,
          'add'
        );

        this.cdr.detectChanges();
      }
    });
  }

  // Update existing school
  private updateExistingSchool(): void {
    if (this.editingSchoolId === null) {
      this.saving = false;
      this.errorMessage = 'No school selected for editing.';
      return;
    }

    const request: UpdateSchoolRequest = {
      schoolId: this.editingSchoolId,
      name: this.newSchool.name.trim(),
      address: this.newSchool.address.trim(),
      phone: this.newSchool.phone.trim()
    };

    this.schoolsService.updateSchool(request).subscribe({
      next: () => {
        this.saving = false;
        this.showAddForm = false;
        this.isEditMode = false;
        this.editingSchoolId = null;

        this.resetForm();

        this.successMessage = 'School updated successfully!';

        this.loadSchools();
      },

      error: (error) => {
        console.error('Failed to update school:', error);

        this.saving = false;
        this.errorMessage = this.getActionErrorMessage(
          error,
          'update'
        );

        this.cdr.detectChanges();
      }
    });
  }

  // Activate school
  activateSchool(school: School): void {
    if (this.changingStatusSchoolId !== null) {
      return;
    }

    if (school.isActive) {
      this.errorMessage = `${school.name} is already active.`;
      this.successMessage = '';
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to activate "${school.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.changingStatusSchoolId = school.schoolId;
    this.errorMessage = '';
    this.successMessage = '';

    this.schoolsService.activateSchool(school.schoolId).subscribe({
      next: () => {
        this.changingStatusSchoolId = null;

        this.successMessage =
          `${school.name} activated successfully!`;

        this.loadSchools();
      },

      error: (error) => {
        console.error('Failed to activate school:', error);

        this.changingStatusSchoolId = null;
        this.errorMessage = this.getActionErrorMessage(
          error,
          'activate'
        );

        this.cdr.detectChanges();
      }
    });
  }

  // Deactivate school
  deactivateSchool(school: School): void {
    if (this.changingStatusSchoolId !== null) {
      return;
    }

    if (!school.isActive) {
      this.errorMessage = `${school.name} is already inactive.`;
      this.successMessage = '';
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${school.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.changingStatusSchoolId = school.schoolId;
    this.errorMessage = '';
    this.successMessage = '';

    this.schoolsService.deactivateSchool(school.schoolId).subscribe({
      next: () => {
        this.changingStatusSchoolId = null;

        this.successMessage =
          `${school.name} deactivated successfully!`;

        this.loadSchools();
      },

      error: (error) => {
        console.error('Failed to deactivate school:', error);

        this.changingStatusSchoolId = null;
        this.errorMessage = this.getActionErrorMessage(
          error,
          'deactivate'
        );

        this.cdr.detectChanges();
      }
    });
  }

  // Handle action errors
 private getActionErrorMessage(
  error: any,
  action: string
): string {
  if (error?.status === 401) {
    return 'Your session may have expired. Please log in again.';
  }

  if (error?.status === 403) {
    return `You do not have permission to ${action} schools.`;
  }

  return this.getErrorMessage(
    error,
    `Unable to ${action} school. Please try again.`
  );
}

private getErrorMessage(
  error: any,
  fallback: string
): string {
  const response = error?.error;

  if (typeof response === 'string' && response.trim()) {
    return response;
  }

  if (typeof response === 'object' && response !== null) {
    return (
      response.Message ||
      response.message ||
      response.detail ||
      response.title ||
      fallback
    );
  }

  return fallback;
}

}
