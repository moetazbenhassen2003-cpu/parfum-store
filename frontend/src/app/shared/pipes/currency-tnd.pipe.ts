import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyTnd',
  standalone: true
})
export class CurrencyTndPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('fr-DZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value) + ' TND';
  }
}
