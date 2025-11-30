import { InjectionToken } from '@angular/core';

export interface ProjectsApiConfig {
  baseUrl: string;
  cacheTtlMs: number;
}

export const PROJECTS_API_CONFIG = new InjectionToken<ProjectsApiConfig>(
  'PROJECTS_API_CONFIG',
  {
    providedIn: 'root',
    factory: (): ProjectsApiConfig => ({
      // default values in the case if app does not provide any
      baseUrl: 'http://localhost:3555',
      cacheTtlMs: 10_000, //
    }),
  },
);
