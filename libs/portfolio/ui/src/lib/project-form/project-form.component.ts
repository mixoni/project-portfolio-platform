import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Project } from '@portfolio/data-access';

export type ProjectFormValue = {
  name: string;
  status: Project['status'];
  owner: string;
  riskLevel: Project['riskLevel'];
  budget: number | null;
  startDate: string | null;
  endDate: string | null;
};

type ProjectFormGroup = FormGroup<{
  name: FormControl<string>;
  status: FormControl<Project['status']>;
  owner: FormControl<string>;
  riskLevel: FormControl<Project['riskLevel']>;
  budget: FormControl<number | null>;
  startDate: FormControl<string | null>;
  endDate: FormControl<string | null>;
}>;

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
  @Input() initialValue: Partial<Project> | null = null;
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

    if (this.initialValue) {
      this.patchInitial(this.initialValue);
    }
  }

  private patchInitial(value: Partial<Project>) {
    this.form.patchValue({
      name: value.name ?? '',
      status: value.status ?? 'PLANNED',
      owner: value.owner ?? '',
      riskLevel: value.riskLevel ?? 'MEDIUM',
      budget: value.budget ?? null,
      startDate: value.startDate ?? null,
      endDate: value.endDate ?? null,
    });
  }

  get f() { return this.form.controls; }

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && this.initialValue) {
      const v: ProjectFormValue = {
        name: this.initialValue.name ?? '',
        status: this.initialValue.status ?? 'PLANNED',
        owner: this.initialValue.owner ?? '',
        riskLevel: this.initialValue.riskLevel ?? 'MEDIUM',
        budget:
          typeof this.initialValue.budget === 'number'
            ? this.initialValue.budget
            : null,
        startDate: this.initialValue.startDate ?? null,
        endDate: this.initialValue.endDate ?? null,
      };

      this.form.patchValue(v);
    }
  }
}
