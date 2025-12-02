import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { ColumnDef } from '../table-types';

interface TestRow {
  id: number;
  name: string;
}

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent<TestRow>>;
  let component: DataTableComponent<TestRow>;
  let nativeEl: HTMLElement;

  const mockColumns: ColumnDef<TestRow>[] = [
    { key: 'name', header: 'Name' },
  ];

  const mockRows: TestRow[] = [
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Beta' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent<TestRow>);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement as HTMLElement;

    component.columns = mockColumns;
    component.rows = mockRows;
    fixture.detectChanges();
  });

  it('should render headers', () => {
    const ths = Array.from(nativeEl.querySelectorAll('thead th')).map(h =>
      h.textContent?.trim()
    );
    expect(ths).toEqual(['Name']);
  });

  it('should render rows', () => {
    const tds = Array.from(nativeEl.querySelectorAll('tbody tr td')).map(td =>
      td.textContent?.trim()
    );
    expect(tds).toEqual(['Alpha', 'Beta']);
  });

  it('should show empty message if no rows', () => {
    component.rows = [];
    component.emptyMessage = 'No data';
    fixture.detectChanges();

    const cell = nativeEl.querySelector('tbody tr td')!;
    expect(cell.textContent?.trim()).toBe('No data');
  });

  it('should emit rowClicked when clickableRows', () => {
    component.clickableRows = true;
    fixture.detectChanges();

    const spy = jest.fn();
    component.rowClicked.subscribe(spy);

    const firstRow = nativeEl.querySelector('tbody tr') as HTMLElement;
    firstRow.click();

    expect(spy).toHaveBeenCalledWith(mockRows[0]);
  });
});
