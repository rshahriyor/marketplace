import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatPhone' })
export class FormatPhonePipe implements PipeTransform {
  transform(phone: number | string): string | null {
    if (!phone) return null;
  
    let digits = phone.toString().replace(/\D/g, '');
  
    if (digits.startsWith('992')) {
      digits = digits.substring(3);
    }
  
    const match = digits.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (!match) return phone.toString();
  
    const [, region, part1, part2, part3] = match;
    return `(${region}) ${part1} ${part2} ${part3}`;
  }
}