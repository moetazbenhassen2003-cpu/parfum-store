import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      const currentUrl = router.url;
      const isAuthEndpoint = req.url.includes('/api/auth/');

      if (error.status === 401) {
        authService.logout();
        // Only show toast and redirect if NOT already on login page
        if (!currentUrl.includes('/login') && !isAuthEndpoint) {
          toastService.error('Session expirée. Veuillez vous reconnecter.');
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        router.navigate(['/']);
        toastService.error('Accès refusé');
      } else if (error.status === 500) {
        const msg = error.error?.message || error.error?.error || 'Erreur serveur. Veuillez réessayer.';
        toastService.error(msg);
      } else if (error.status === 400) {
        const msg = error.error?.message || error.error?.error || 'Données invalides.';
        toastService.error(msg);
      }

      return throwError(() => error);
    })
  );
};
