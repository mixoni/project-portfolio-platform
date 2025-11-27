import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from './models/project.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectsApi {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getProjects(filter?: { status?: string; owner?: string }): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`, {
      params: filter as any,
    });
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`);
  }
  

  createProject(data: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, data);
  }

  updateProject(id: number, data: Partial<Project>): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/projects/${id}`, data);
  }
}
