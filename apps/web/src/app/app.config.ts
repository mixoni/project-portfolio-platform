import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { HttpClientModule, HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { PROJECTS_API_CONFIG } from '@portfolio/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: PROJECTS_API_CONFIG,
      useValue: {
        baseUrl: 'http://localhost:3000', // ili iz environment-a
        cacheTtlMs: 5_000,                // npr. 5 sekundi za demo
      },
    },
  ],
};
