import { Pipe, PipeTransform } from '@angular/core';

export type DisplayFormat = 'text' | 'number' | 'date' | 'currency';

@Pipe({
  name: 'displayValue',
  standalone: true,
})
export class DisplayValuePipe implements PipeTransform {
  transform(
    value: any,
    emptyPlaceholder: string = '—',
    format: DisplayFormat = 'text',
    formatOptions?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions,
    currency: string = 'EUR'
  ): string {
    if (value === null || value === undefined || value === '') {
      return emptyPlaceholder;
    }

    switch (format) {
      case 'number':
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
          ...(formatOptions as Intl.NumberFormatOptions),
        }).format(Number(value));

      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          ...(formatOptions as Intl.NumberFormatOptions),
        }).format(Number(value));

      case 'date': {
        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) {
          return String(value);
        }
        return new Intl.DateTimeFormat('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          ...(formatOptions as Intl.DateTimeFormatOptions),
        }).format(date);
      }

      case 'text':
      default:
        return String(value);
    }
  }
}
