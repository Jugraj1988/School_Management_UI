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

  console.log('Login response:', response);

  if (!response?.user) {
    this.errorMessage = 'Invalid login response.';
    return;
  }

  if (!response.user.isActive) {
    this.authService.logout();
    this.errorMessage = 'Your account is inactive.';
    return;
  }

  const roleName = response.user.roleName?.trim().toLowerCase();

  console.log('Logged-in role:', roleName);

  if (roleName === 'super admin') {
    this.router.navigate(['/dashboard']);
  }
  else if (roleName === 'school admin') {
    this.router.navigate(['/school-admin/dashboard']);
  }
  else if (roleName === 'teacher') {
    this.router.navigate(['/teacher/dashboard']);
  }
  
   else if (roleName === 'student') {
    this.router.navigate(['/student/dashboard']);
  }
  else {
    this.errorMessage = `Invalid user role: ${response.user.roleName}`;
  }

  
  

  this.cdr.detectChanges();
},
        error: err => {
          console.error('Login error:', err);
          this.errorMessage = 'Login failed. Please check your credentials.';
          this.cdr.detectChanges();
        }
      });
  }
}
