import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, finalize } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /** Da ne radimo 15 redirecta ako stignu paralelni 401 */
  private handling401 = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    let authReq = req;

    const token = this.auth.getToken();
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // If the backend returns 401 – clear the session and redirect to /login
        if (error.status === 401) {
          const isLoginCall = req.url.includes('/auth/login');

          if (!isLoginCall && !this.handling401) {
            this.handling401 = true;

            this.auth.logout();

            const returnUrl = this.router.url;

            if (this.router.url !== '/login') {
              this.router.navigate(['/login'], {
                queryParams: { returnUrl },
              });
            }
          }
        }

        return throwError(() => error);
      }),
      finalize(() => {
        this.handling401 = false;
      }),
    );
  }
}
