import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnDef } from '../table-types';
import { DisplayValuePipe } from '../pipes/display-value/display-value.pipe';

@Component({
  selector: 'shared-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DisplayValuePipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T extends Record<string, any>> {
  @Input() rows: T[] = [];
  @Input() columns: ColumnDef<T>[] = [];

  @Input() loading = false;
  @Input() emptyMessage = 'No data';
  @Input() clickableRows = false;

  // Toolbar
  @Input() showToolbar = false;
  @Input() enableSearch = false;
  @Input() searchPlaceholder = 'Search…';
  @Input() set searchTerm(value: string) {
    this._searchTerm = value ?? '';
  }
  get searchTerm() {
    return this._searchTerm;
  }
  private _searchTerm = '';

  @Input() showCreateButton = false;
  @Input() createLabel = 'New';

  // Row context menu
  @Input() showRowMenu = false;

  @Output() rowClick = new EventEmitter<T>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() createClicked = new EventEmitter<void>();

  @Output() editRow = new EventEmitter<T>();
  @Output() deleteRow = new EventEmitter<T>();

  private menuOpenIndex: number | null = null;

  trackByIndex = (index: number, _row: unknown) => index;

  onRowClicked(row: T) {
    if (this.clickableRows) {
      this.rowClick.emit(row);
    }
  }

  onSearchInput(value: string) {
    this._searchTerm = value;
    this.searchChange.emit(value);
  }

  onCreateClick() {
    this.createClicked.emit();
  }

  getCell(row: T, col: ColumnDef<T>): unknown {
    if (col.cell) return col.cell(row);
    return (row as any)[col.key as string];
  }

  toggleMenu(index: number) {
    this.menuOpenIndex = this.menuOpenIndex === index ? null : index;
  }

  onEdit(row: T) {
    this.editRow.emit(row);
    this.menuOpenIndex = null;
  }

  onDelete(row: T) {
    this.deleteRow.emit(row);
    this.menuOpenIndex = null;
  }

  closeMenu() {
    this.menuOpenIndex = null;
  }
}
