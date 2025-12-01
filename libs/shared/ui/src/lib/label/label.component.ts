import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DisplayValuePipe, DisplayFormat } from '../pipes/display-value/display-value.pipe';

@Component({
  selector: 'shared-label-value',
  standalone: true,
  imports: [CommonModule, DisplayValuePipe],
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelValueComponent {
  @Input() label!: string;
  @Input() value: any;

  @Input() format: DisplayFormat = 'text';
  @Input() emptyPlaceholder = '—';
  @Input() currency = 'EUR';
}
