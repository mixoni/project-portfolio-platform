import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, shareReplay, finalize } from 'rxjs/operators';
import { Project } from './models/project.model';
import { RequestCacheService } from './cache/request-cache.service';
import { PROJECTS_API_CONFIG, ProjectsApiConfig } from './project-api.config';

export type ProjectsFilter = {
  status?: string;
  owner?: string;
};

@Injectable({ providedIn: 'root' })
export class ProjectsApi {

  constructor(
    private readonly http: HttpClient,
    private readonly cache: RequestCacheService,
    @Inject(PROJECTS_API_CONFIG)
    private readonly config: ProjectsApiConfig,
  ) {}

  getProjects(filter?: ProjectsFilter): Observable<Project[]> {
    const key = this.buildCacheKey(filter);

    // 1) pokušaj keš
    const cached = this.cache.get<Project[]>(key, this.config.cacheTtlMs);
    if (cached) {
      return of(cached);
    }

    // 2) ako već postoji in-flight request za isti ključ, koristi njega
    const inflight = this.cache.getInflight<Project[]>(key);
    if (inflight) {
      return inflight;
    }

    // 3) pravi HTTP request
    const params = this.buildHttpParams(filter);

    const request$ = this.http
      .get<Project[]>(`${this.config.baseUrl}/projects`, { params })
      .pipe(
        tap((projects) => {
          this.cache.set<Project[]>(key, projects);
        }),
        shareReplay(1),
        finalize(() => {
          this.cache.clearInflight(key);
        }),
      );

    this.cache.setInflight<Project[]>(key, request$);

    return request$;
  }

  createProject(data: Partial<Project>): Observable<Project> {
    return this.http
      .post<Project>(`${this.config.baseUrl}/projects`, data)
      .pipe(tap(() => this.cache.clearAll()));
  }

  updateProject(id: number, data: Partial<Project>): Observable<Project> {
    return this.http
      .patch<Project>(`${this.config.baseUrl}/projects/${id}`, data)
      .pipe(tap(() => this.cache.clearAll()));
  }

  deleteProject(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.config.baseUrl}/projects/${id}`)
      .pipe(tap(() => this.cache.clearAll()));
  }

  // ---------------------------------------------------------------------------
  // Helpers - can be moved to a separate utils file if needed
  // ---------------------------------------------------------------------------

  private buildCacheKey(filter?: ProjectsFilter): string {
    if (!filter) return '__all__';

    const entries = Object.entries(filter)
      .filter(([, value]) => value != null && value !== '')
      .sort(([a], [b]) => a.localeCompare(b));

    if (entries.length === 0) {
      return '__all__';
    }

    return entries.map(([k, v]) => `${k}=${v}`).join('&');
  }

  private buildHttpParams(filter?: ProjectsFilter): HttpParams {
    let params = new HttpParams();

    if (!filter) return params;

    if (filter.status) {
      params = params.set('status', filter.status);
    }
    if (filter.owner) {
      params = params.set('owner', filter.owner);
    }

    return params;
  }
}
