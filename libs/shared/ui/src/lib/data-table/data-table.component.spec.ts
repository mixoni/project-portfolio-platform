import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataTableComponent } from './data-table.component';
import { ColumnDef } from '../table-types';

type ProjectRow = { id: number; name: string; owner: string };

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent<ProjectRow>>;
  let component: DataTableComponent<ProjectRow>;

  const rows: ProjectRow[] = [
    { id: 1, name: 'Project A', owner: 'John' },
    { id: 2, name: 'Project B', owner: 'Anna' },
  ];

  const columns: ColumnDef<any>[] = [
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent], // standalone komponenta
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent<ProjectRow>);
    component = fixture.componentInstance;
  });

  function setupWithBasicData() {
    component.rows = rows;
    component.columns = columns;
    fixture.detectChanges();
  }

  // ----------------------------------------------------------------
  // CREATING
  // ----------------------------------------------------------------
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ----------------------------------------------------------------
  // RENDER TABLE / COMNUS / ROWS
  // ----------------------------------------------------------------
  it('should render header cells from columns', () => {
    setupWithBasicData();
  
    const headerCells = fixture.debugElement.queryAll(
      By.css('table.pp-table thead th')
    );
  
    expect(headerCells.length).toBe(columns.length);
  
    const renderedHeaders = headerCells.map(h =>
      h.nativeElement.textContent.trim()
    );
    const expectedHeaders = columns.map(c => c.header);
  
    expect(renderedHeaders).toEqual(expectedHeaders);
  });

  it('should render all data rows', () => {
    setupWithBasicData();

    const bodyRows = fixture.debugElement.queryAll(
      By.css('table.pp-table tbody tr')
    );

    // nema empty-row jer rows.length > 0
    expect(bodyRows.length).toBe(rows.length);
  });

  it('should render cell values based on row & column key', () => {
    setupWithBasicData();
  
    const firstRowCells = fixture.debugElement.queryAll(
      By.css('table.pp-table tbody tr:first-child td')
    );
  
    // Check if data properly mapped
    columns.forEach((col, colIndex) => {
      const cellText = firstRowCells[colIndex].nativeElement.textContent.trim();
      const expectedValue = (rows[0] as any)[col.key as string];
  
      // If the value exists then display it (if not then display "—")
      if (expectedValue != null && expectedValue !== '') {
        expect(cellText).toBe(String(expectedValue));
      }
    });
  });

  it('should use col.cell function when provided', () => {
    component.rows = rows;
    component.columns = [
      {
        key: 'name',
        header: 'Name',
        cell: (row: ProjectRow) => `★ ${row.name}`,
      },
    ] as any;
    fixture.detectChanges();

    const cell = fixture.debugElement.query(
      By.css('table.pp-table tbody tr:first-child td')
    );
    expect(cell.nativeElement.textContent.trim()).toBe('★ Project A');
  });

  // ----------------------------------------------------------------
  // EMPTY STATE / NO COLUMNS
  // ----------------------------------------------------------------
  it('should show empty message row when there are no rows', () => {
    component.rows = [];
    component.columns = columns;
    component.emptyMessage = 'Nothing here';
    fixture.detectChanges();

    const emptyCell = fixture.debugElement.query(
      By.css('table.pp-table tbody tr td.pp-empty')
    );

    expect(emptyCell).toBeTruthy();
    expect(emptyCell.nativeElement.textContent.trim()).toBe('Nothing here');
  });

  it('should show "No columns configured" when there are no columns', () => {
    component.rows = rows;
    component.columns = [];
    fixture.detectChanges();

    const emptyDiv = fixture.debugElement.query(
      By.css('.pp-empty')
    );
    expect(emptyDiv).toBeTruthy();
    expect(emptyDiv.nativeElement.textContent.trim()).toBe(
      'No columns configured'
    );

    const table = fixture.debugElement.query(By.css('table.pp-table'));
    expect(table).toBeNull();
  });

  // ----------------------------------------------------------------
  // LOADING STATE / SKELETON
  // ----------------------------------------------------------------
  it('should show skeleton rows when loading is true', () => {
    component.loading = true;
    component.columns = columns;
    fixture.detectChanges();

    const skeletonRows = fixture.debugElement.queryAll(
      By.css('.pp-skeleton-row')
    );
    expect(skeletonRows.length).toBe(4); // [0,1,2,3]

    const table = fixture.debugElement.query(By.css('table.pp-table'));
    expect(table).toBeNull(); // dok je loading, tabela se ne prikazuje
  });

  // ----------------------------------------------------------------
  // TOOLBAR / SEARCH / CREATE BUTTON
  // ----------------------------------------------------------------
  it('should show toolbar when showToolbar is true', () => {
    setupWithBasicData();
    component.showToolbar = true;
    fixture.detectChanges();

    const toolbar = fixture.debugElement.query(By.css('.pp-table-toolbar'));
    expect(toolbar).toBeTruthy();
  });

  it('should show search input when toolbar and enableSearch are true', () => {
    setupWithBasicData();
    component.showToolbar = true;
    component.enableSearch = true;
    component.searchPlaceholder = 'Search by name';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    expect(input).toBeTruthy();
    expect(input.nativeElement.placeholder).toBe('Search by name');
  });

  it('should emit searchChange and update searchTerm when typing', () => {
    setupWithBasicData();
    component.showToolbar = true;
    component.enableSearch = true;
    fixture.detectChanges();

    jest.spyOn(component.searchChange, 'emit');

    const inputDe = fixture.debugElement.query(
      By.css('input[type="search"]')
    );
    const inputEl = inputDe.nativeElement as HTMLInputElement;

    inputEl.value = 'proj';
    inputEl.dispatchEvent(new Event('input')); // ngModel
    fixture.detectChanges();

    expect(component.searchTerm).toBe('proj');
    expect(component.searchChange.emit).toHaveBeenCalledWith('proj');
  });

  it('should show create button and emit createClicked on click', () => {
    setupWithBasicData();
    component.showToolbar = true;
    component.showCreateButton = true;
    component.createLabel = 'New project';
    fixture.detectChanges();

    jest.spyOn(component.createClicked, 'emit');

    const btn = fixture.debugElement.query(
      By.css('.pp-btn.pp-btn-primary')
    );
    expect(btn).toBeTruthy();
    expect(btn.nativeElement.textContent.trim()).toBe('New project');

    btn.nativeElement.click();
    expect(component.createClicked.emit).toHaveBeenCalled();
  });

  // ----------------------------------------------------------------
  // ROW CLICK
  // ----------------------------------------------------------------
  it('should emit rowClick when clickableRows is true', () => {
    setupWithBasicData();
    component.clickableRows = true;
    fixture.detectChanges();

    jest.spyOn(component.rowClick, 'emit');

    const firstRow = fixture.debugElement.query(
      By.css('table.pp-table tbody tr')
    );
    firstRow.nativeElement.click();

    expect(component.rowClick.emit).toHaveBeenCalledWith(rows[0]);
  });

  it('should NOT emit rowClick when clickableRows is false', () => {
    setupWithBasicData();
    component.clickableRows = false;
    fixture.detectChanges();

    jest.spyOn(component.rowClick, 'emit');

    const firstRow = fixture.debugElement.query(
      By.css('table.pp-table tbody tr')
    );
    firstRow.nativeElement.click();

    expect(component.rowClick.emit).not.toHaveBeenCalled();
  });

  // ----------------------------------------------------------------
  // ROW MENU (EDIT / DELETE)
  // ----------------------------------------------------------------
  it('should render row menu header and actions when showRowMenu is true', () => {
    setupWithBasicData();
    component.showRowMenu = true;
    fixture.detectChanges();

    const headerActions = fixture.debugElement.query(
      By.css('th.pp-actions-header')
    );
    expect(headerActions).toBeTruthy();

    const actionCells = fixture.debugElement.queryAll(
      By.css('td.pp-row-actions')
    );
    expect(actionCells.length).toBe(rows.length);
  });

  it('should toggle row menu for a row', () => {
    setupWithBasicData();
    component.showRowMenu = true;
    fixture.detectChanges();

    const toggleBtn = fixture.debugElement.query(
      By.css('td.pp-row-actions .pp-icon-button')
    );
    expect(toggleBtn).toBeTruthy();

    // initially nema menija
    let menu = fixture.debugElement.query(By.css('.pp-row-menu'));
    expect(menu).toBeNull();

    // klik da otvori
    toggleBtn.nativeElement.click();
    fixture.detectChanges();

    menu = fixture.debugElement.query(By.css('.pp-row-menu'));
    expect(menu).toBeTruthy();

    // klik da zatvori
    toggleBtn.nativeElement.click();
    fixture.detectChanges();

    menu = fixture.debugElement.query(By.css('.pp-row-menu'));
    expect(menu).toBeNull();
  });

  it('should emit editRow and close menu on Edit click', () => {
    setupWithBasicData();
    component.showRowMenu = true;
    fixture.detectChanges();

    jest.spyOn(component.editRow, 'emit');

    // open menu
    const toggleBtn = fixture.debugElement.query(
      By.css('td.pp-row-actions .pp-icon-button')
    );
    toggleBtn.nativeElement.click();
    fixture.detectChanges();

    const editBtn = fixture.debugElement.query(
      By.css('.pp-row-menu button:first-child')
    );
    expect(editBtn.nativeElement.textContent.trim()).toBe('Edit');

    editBtn.nativeElement.click();
    fixture.detectChanges();

    expect(component.editRow.emit).toHaveBeenCalledWith(rows[0]);

    const menu = fixture.debugElement.query(By.css('.pp-row-menu'));
    expect(menu).toBeNull();
  });

  it('should emit deleteRow and close menu on Delete click', () => {
    setupWithBasicData();
    component.showRowMenu = true;
    fixture.detectChanges();

    jest.spyOn(component.deleteRow, 'emit');

    // open menu
    const toggleBtn = fixture.debugElement.query(
      By.css('td.pp-row-actions .pp-icon-button')
    );
    toggleBtn.nativeElement.click();
    fixture.detectChanges();

    const deleteBtn = fixture.debugElement.query(
      By.css('.pp-row-menu button.danger')
    );
    expect(deleteBtn.nativeElement.textContent.trim()).toBe('Delete');

    deleteBtn.nativeElement.click();
    fixture.detectChanges();

    expect(component.deleteRow.emit).toHaveBeenCalledWith(rows[0]);

    const menu = fixture.debugElement.query(By.css('.pp-row-menu'));
    expect(menu).toBeNull();
  });
});
