
import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const isLoginRequest =
    req.url.toLowerCase().includes('/authentication/login');

  // Login does not require an existing JWT.
  if (isLoginRequest) {
    return next(req);
  }

  // Read token from the current browser tab.
  const token = sessionStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
