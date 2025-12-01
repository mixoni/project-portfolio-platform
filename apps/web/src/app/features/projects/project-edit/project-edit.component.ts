import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectsApi } from '@portfolio/data-access';
import {
  ProjectFormComponent,
  ProjectFormValue,
} from '@portfolio/ui';

@Component({
  selector: 'app-project-edit-page',
  standalone: true,
  imports: [CommonModule, ProjectFormComponent],
  templateUrl: './project-edit.component.html',
styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditPageComponent implements OnInit {
  private readonly api = inject(ProjectsApi) as ProjectsApi;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly project = signal<Project | null>(null);

  private projectId!: number;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/projects']);
      return;
    }

    this.projectId = Number(idParam);
    this.loadProject();
  }

  private loadProject() {
    this.loading.set(true);
    this.error.set(null);

    this.api.getProject(this.projectId).subscribe({
      next: (p:any) => {
        this.project.set(p);
        this.loading.set(false);
      },
      error: (err:any) => {
        console.error(err);
        this.error.set('Failed to load project');
        this.loading.set(false);
      },
    });
  }

  onSubmit(value: ProjectFormValue) {
    this.saving.set(true);
    this.error.set(null);

    this.api.updateProject(this.projectId, value).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to save project');
        this.saving.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate(['/projects']);
  }
}
