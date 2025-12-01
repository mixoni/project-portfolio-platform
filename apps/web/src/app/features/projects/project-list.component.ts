import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Project, ProjectsApi } from '@portfolio/data-access';
import { ColumnDef, DataTableComponent } from '@shared/ui';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DataTableComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  private readonly api = inject(ProjectsApi) as ProjectsApi;

  // state
  private readonly _projects = signal<Project[]>([]);
  readonly projects = this._projects.asReadonly();

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // filters (signals)
  private readonly _statusFilter = signal<'ALL' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  private readonly _ownerFilter = signal('');

  // bridge for ngModel (Angular does not directly recognize signals)
  get statusFilterModel() {
    return this._statusFilter();
  }
  set statusFilterModel(value: 'ALL' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED') {
    this._statusFilter.set(value);
    this.reload();
  }

  get ownerFilterModel() {
    return this._ownerFilter();
  }
  set ownerFilterModel(value: string) {
    this._ownerFilter.set(value);
    this.reload();
  }

  // columns for the table
  readonly columns: ColumnDef<Project>[] = [
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' },
    { key: 'owner', header: 'Owner' },
    { key: 'riskLevel', header: 'Risk', align: 'center' },
    {
      key: 'budget',
      header: 'Budget',
      format: 'currency',
      align: 'right',
    },
    {
      key: 'startDate',
      header: 'Start',
      format: 'date',
    },
    {
      key: 'endDate',
      header: 'End',
      format: 'date',
    },
  ];


  // computed that creates the filter object
  private readonly currentFilter = computed(() => {
    const status = this._statusFilter();
    const owner = this._ownerFilter().trim();

    return {
      status: status === 'ALL' ? undefined : status,
      owner: owner || undefined,
    };
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);

    const filter = this.currentFilter();

    this.api.getProjects(filter).subscribe({
      next: (projects) => {
        this._projects.set(projects);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load projects');
        this.loading.set(false);
      },
    });
  }

  onProjectRowClick(project: Project) {
    console.log('Clicked project:', project);
  }
}
