import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectFormComponent, ProjectFormValue } from './project-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';

describe('ProjectFormComponent', () => {
  let fixture: ComponentFixture<ProjectFormComponent>;
  let component: ProjectFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProjectFormComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create form with defaults', () => {
    const v = component.form.value;
    expect(v.status).toBe('PLANNED');
    expect(v.riskLevel).toBe('MEDIUM');
  });

  it('should patch form when initialValue changes', () => {
    const initial = {
      name: 'Project Alpha',
      status: 'IN_PROGRESS',
      owner: 'admin',
      riskLevel: 'LOW',
      budget: 100000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    };

    component.initialValue = initial;
    component.ngOnChanges({
      initialValue: new SimpleChange(null, initial, true),
    });
    fixture.detectChanges();

    const v = component.form.value as ProjectFormValue;
    expect(v.name).toBe('Project Alpha');
    expect(v.status).toBe('IN_PROGRESS');
    expect(v.owner).toBe('admin');
    expect(v.budget).toBe(100000);
  });

  it('should emit submitted value when form is valid', () => {
    const spy = jest.fn();
    component.submitted.subscribe(spy);

    component.form.setValue({
      name: 'New project',
      status: 'PLANNED',
      owner: 'Miljan',
      riskLevel: 'MEDIUM',
      budget: 5000,
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith({
      name: 'New project',
      status: 'PLANNED',
      owner: 'Miljan',
      riskLevel: 'MEDIUM',
      budget: 5000,
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    });
  });

  it('should not emit if form is invalid', () => {
    const spy = jest.fn();
    component.submitted.subscribe(spy);

    component.form.patchValue({ name: '' }); // required
    component.onSubmit();

    expect(spy).not.toHaveBeenCalled();
  });
});
