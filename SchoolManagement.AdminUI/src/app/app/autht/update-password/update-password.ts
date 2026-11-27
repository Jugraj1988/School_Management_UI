import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AuthService } from '../../../core/services/AuthService';
@Component({
  selector: 'app-update-password',
  standalone: false,
  templateUrl: './update-password.html',
  styleUrl: './update-password.css'
})
export class UpdatePassword {

  passwordForm: FormGroup;

  loading = false;
  successMessage = '';
  errorMessage = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
      private authenticationService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],

      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {

    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword === confirmPassword
      ? null
      : { passwordMismatch: true };
  }


changePassword(): void {

  this.successMessage = '';
  this.errorMessage = '';

  if (this.passwordForm.invalid) {
    this.passwordForm.markAllAsTouched();
    return;
  }

  this.loading = true;

  const request = {
    currentPassword: this.passwordForm.value.currentPassword,
    newPassword: this.passwordForm.value.newPassword
  };

  this.authenticationService.changePassword(request).subscribe({

    next: (response: any) => {

      this.loading = false;

      this.successMessage =
        response?.message || 'Password changed successfully.';

      this.passwordForm.reset();

      this.showCurrentPassword = false;
      this.showNewPassword = false;
      this.showConfirmPassword = false;

      this.cdr.detectChanges();

      // Wait 2 seconds so the success message is visible
      setTimeout(() => {

        // Clear current login session
        this.authenticationService.logout();

        // Redirect to login
        this.router.navigate(['/login']);

      }, 2000);
    },

    error: (error) => {

      console.error('Change password error:', error);

      this.loading = false;

      this.errorMessage =
        error.error?.message ||
        error.error?.Message ||
        'Unable to change password. Please try again.';

      this.cdr.detectChanges();
    }
  });
}


  get currentPassword(): AbstractControl | null {
    return this.passwordForm.get('currentPassword');
  }

  get newPassword(): AbstractControl | null {
    return this.passwordForm.get('newPassword');
  }

  get confirmPassword(): AbstractControl | null {
    return this.passwordForm.get('confirmPassword');
  }
}