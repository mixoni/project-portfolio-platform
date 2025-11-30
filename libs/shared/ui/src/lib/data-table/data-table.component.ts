import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() loading = false;
  @Input() emptyMessage = 'No data to display';
  @Input() clickableRows = false;

  @Output() rowClick = new EventEmitter<T>();

  trackByIndex = (index: number, _row: unknown) => index;

  getCell(row: T, col: ColumnDef<T>): unknown {
    if (col.cell) {
      return col.cell(row);
    }

    const key = col.key as string;
    return (row as any)[key] ?? '';
  }

  onRowClicked(row: T) {
    if (this.clickableRows) {
      this.rowClick.emit(row);
    }
  }
}
