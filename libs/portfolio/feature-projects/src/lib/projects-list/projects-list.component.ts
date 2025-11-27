import { Component, effect, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ProjectsSelectors from '../state/projects.selectors';
import * as ProjectsActions from '../state/projects.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { ProjectTableComponent } from '@portfolio/ui';

@Component({
  standalone: true,
  selector: 'portfolio-projects-list',
  imports: [NgIf, NgFor, AsyncPipe, ProjectTableComponent],
  template: `
    <section>
      <h2>Projects</h2>
      <div class="filters">
        <label>
          Status:
          <select [value]="status()" (change)="onStatusChange($event.target.value)">
            <option value="">All</option>
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In progress</option>
          </select>
        </label>
      </div>

      <div *ngIf="loading(); else listTpl">Loading...</div>
      <ng-template #listTpl>
        <portfolio-project-table [projects]="projects()"></portfolio-project-table>
      </ng-template>
    </section>
  `,
})
export class ProjectsListComponent {
  readonly status = signal<string>('');
  readonly owner = signal<string>('');

  readonly projects = toSignal(this.store.select(ProjectsSelectors.selectProjects), {
    initialValue: [],
  });
  readonly loading = toSignal(this.store.select(ProjectsSelectors.selectProjectsLoading), {
    initialValue: false,
  });

  constructor(private store: Store) {
    effect(() => {
      this.store.dispatch(
        ProjectsActions.loadProjects({
          status: this.status() || undefined,
          owner: this.owner() || undefined,
        }),
      );
    });
  }

  onStatusChange(status: string) {
    this.status.set(status);
  }
}
