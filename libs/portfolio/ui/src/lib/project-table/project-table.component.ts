import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '@portfolio/data-access';
import { DataTableComponent } from '@shared/ui';
import { ColumnDef } from '@shared/ui';

@Component({
  selector: 'portfolio-project-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <shared-data-table
      [rows]="projects"
      [columns]="effectiveColumns()"
    ></shared-data-table>
  `,
})
export class ProjectTableComponent {
  @Input() projects: Project[] = [];

  // optional custom columns from the user library
  @Input() set columns(value: ColumnDef<Project>[] | null | undefined) {
    this._columns.set(value ?? null);
  }

  private _columns = signal<ColumnDef<Project>[] | null>(null);

  // default columns for most cases
  private readonly defaultColumns: ColumnDef<Project>[] = [
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' },
    { key: 'owner', header: 'Owner' },
    { key: 'riskLevel', header: 'Risk' },
    {
      key: 'budget',
      header: 'Budget',
      align: 'right',
      cell: (p) => (p.budget != null ? `${p.budget.toLocaleString()} €` : '-'),
    },
  ];

  effectiveColumns = computed(
    () => this._columns() ?? this.defaultColumns,
  );
}
