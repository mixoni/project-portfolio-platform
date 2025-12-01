import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsApi } from '@portfolio/data-access';
import {
  ProjectFormComponent,
  ProjectFormValue,
} from '@portfolio/ui';

@Component({
  selector: 'app-project-create-page',
  standalone: true,
  imports: [ProjectFormComponent],
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent {
  private readonly api = inject(ProjectsApi);
  private readonly router = inject(Router);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  onSubmit(value: ProjectFormValue) {
    this.saving.set(true);
    this.error.set(null);

    this.api.createProject(value).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to create project');
        this.saving.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate(['/projects']);
  }
}
