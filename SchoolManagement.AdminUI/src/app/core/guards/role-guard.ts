import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/AuthService';

export const roleGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string;
  const currentRole = authService.getUser()?.roleName;

  if (
    authService.isLoggedIn() &&
    currentRole?.trim().toLowerCase() ===
      requiredRole?.trim().toLowerCase()
  ) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

