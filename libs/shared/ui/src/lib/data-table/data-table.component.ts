// data-table.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ColumnDef } from '../table-types';
import { DisplayValuePipe } from '../pipes/display-value/display-value.pipe';

@Component({
  selector: 'shared-data-table',
  standalone: true,
  imports: [CommonModule, DisplayValuePipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T extends Record<string, any>> {
  @Input() rows: T[] = [];
  @Input() columns: ColumnDef<T>[] = [];
  @Input() loading = false;
  @Input() clickableRows = false;
  @Input() emptyMessage = 'No data to display';

  trackByIndex = (index: number, _row: unknown) => index;

  getCell(row: T, col: ColumnDef<T>): unknown {
    if (col.cell) {
      return col.cell(row);
    }
    const key = col.key as keyof T;
    return row[key] ?? null;
  }

  onRowClicked(_row: T) {
    // opcionalno: emit event ako ti treba
  }
}
