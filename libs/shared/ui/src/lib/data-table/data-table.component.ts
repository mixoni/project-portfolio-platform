// data-table.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnDef, RowAction } from '../table-types';
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
  @Input() actions: RowAction[] = [];

  @Output() action = new EventEmitter<{ actionId: string; row: T }>();

  openMenuIndex: number | null = null;

  trackByIndex = (index: number, _row: unknown) => index;

  getCell(row: T, col: ColumnDef<T>): unknown {
    if (col.cell) {
      return col.cell(row);
    }
    const key = col.key as keyof T;
    return row[key] ?? null;
  }

  toggleMenu(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  closeMenu() {
    this.openMenuIndex = null;
  }

  onActionClick(actionId: string, row: T, event: MouseEvent) {
    event.stopPropagation();
    this.action.emit({ actionId, row });
    this.closeMenu();
  }

}
