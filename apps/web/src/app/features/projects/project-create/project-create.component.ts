// apps/web/src/app/features/projects/project-create.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectsApi, Project } from '@portfolio/data-access';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ProjectsApi);
  private readonly router = inject(Router);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    status: ['PLANNED', Validators.required],
    owner: ['', Validators.required],
    riskLevel: ['MEDIUM', Validators.required],
    budget: [null],
    startDate: [null],
    endDate: [null],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const payload = this.form.value as Omit<Project, 'id'>;

    this.api.createProject(payload).subscribe({
      next: () => {
        this.saving.set(false);
        // jednostavno rešenje: vrati se na listu i neka lista sama refresha
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to create project');
        this.saving.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}
