import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { catchError } from "rxjs";
import { Router } from "@angular/router";
import { StatusCodeEnum } from "../enums/status-code.enum";

export const authTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.accessToken;

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (Object.keys(headers).length > 0) {
    req = req.clone({ setHeaders: headers });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const code = error?.error?.status?.code;

      if ([StatusCodeEnum.TOKEN_EXPIRED_ERROR, StatusCodeEnum.AUTHENTICATION_ERROR].includes(code)) {
        router.navigate(['/']);
      }

      throw error;
    })
  );
};