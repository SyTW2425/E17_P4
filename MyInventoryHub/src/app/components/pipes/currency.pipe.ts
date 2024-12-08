import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CurrencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number, currencyCode: string = 'USD'): string {
    if (value == null) return ''; // Si el valor es nulo, no retorna nada

    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    return new Intl.NumberFormat('es-ES', options).format(value); // 'es-ES' se puede cambiar al locale necesario
  }
}
