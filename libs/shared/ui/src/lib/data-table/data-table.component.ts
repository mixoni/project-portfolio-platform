import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ColumnDef } from '../table-types';

@Component({
  selector: 'shared-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T extends Record<string, any>> {
  @Input() rows: T[] = [];
  @Input() columns: ColumnDef<T>[] = [];

  trackByIndex = (index: number, _row: unknown) => index;

  getCell(row: T, col: ColumnDef<T>): unknown {
    if (col.cell) {
      return col.cell(row);
    }

    const key = col.key as string;
    return (row as any)[key] ?? '';
  }
}
