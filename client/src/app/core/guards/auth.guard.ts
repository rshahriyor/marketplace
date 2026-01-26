import { inject } from '@angular/core';
import { Router, CanActivateFn, CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn | CanMatchFn = (): boolean => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  if (authService.accessToken) {
    return true;
  }
  authService.clearTokens();
  router.navigate(['/login']).catch();
  return false;
};
