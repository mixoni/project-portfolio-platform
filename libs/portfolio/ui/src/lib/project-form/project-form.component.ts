import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Project } from "@portfolio/data-access";
import { ProjectFormGroup, ProjectFormValue } from "./project-form.types";

@Component({
  selector: 'portfolio-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent {
  @Input() title: string | null = null;

  private _initialValue: Partial<Project> | null = null;

  @Input()
  set initialValue(value: Partial<Project> | null) {
    this._initialValue = value;

    if (value) {
      this.patchInitial(value);
    }
  }
  get initialValue() {
    return this._initialValue;
  }

  @Input() loading = false;
  @Input() saving = false;
  @Input() error: string | null = null;
  @Input() appearance: 'default' | 'compact' = 'default';

  @Output() submitted = new EventEmitter<ProjectFormValue>();
  @Output() cancelled = new EventEmitter<void>();

  readonly form: ProjectFormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      status: this.fb.control<Project['status']>('PLANNED', {
        nonNullable: true,
      }),
      owner: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      riskLevel: this.fb.control<Project['riskLevel']>('MEDIUM', {
        nonNullable: true,
      }),
      budget: this.fb.control<number | null>(null),
      startDate: this.fb.control<string | null>(null),
      endDate: this.fb.control<string | null>(null),
    });
  }

  private patchInitial(value: Partial<Project>) {
    console.log('value', value);
    console.log('budget type', typeof value.budget);

    this.form.patchValue({
      name: value.name ?? '',
      status: value.status ?? 'PLANNED',
      owner: value.owner ?? '',
      riskLevel: value.riskLevel ?? 'MEDIUM',
      budget: value?.budget ?? 0,
      startDate: value.startDate ?? null,
      endDate: value.endDate ?? null,
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }

  onCancel() {
    this.cancelled.emit();
  }
}
