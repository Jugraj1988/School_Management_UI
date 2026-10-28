import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/services/AuthService';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loading = false;
  errorMessage = '';
  successMessage = '';

  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginForm.getRawValue())
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: response => {
          if (!response?.user) {
            this.errorMessage = 'Invalid login response.';
            this.cdr.detectChanges();
            return;
          }

          if (!response.user.isActive) {
            this.authService.logout();
            this.errorMessage = 'Your account is inactive.';
            this.cdr.detectChanges();
            return;
          }

          const roleName =
            response.user.roleName?.trim().toLowerCase();

          if (roleName === 'super admin') {
            this.router.navigate(['/dashboard']);
            return;
          }

          this.authService.logout();

          this.errorMessage =
            roleName === 'school admin'
              ? 'This application is for Super Admin users only.'
              : 'You do not have permission to access this application.';

          this.cdr.detectChanges();
        },

        error: error => {
          this.errorMessage =
            error?.error?.Message ||
            error?.error?.message ||
            error?.error?.title ||
            'Login failed. Please check your credentials.';

          this.cdr.detectChanges();
        }
      });
  }
}
