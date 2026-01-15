import { Directive, ElementRef, HostListener, inject } from "@angular/core";


@Directive({
    selector: '[mkPhoneMask]'
})

export class PhoneMaskDirective {
    private el = inject(ElementRef);

    @HostListener('input')
    onInput(): void {
      const input = this.el.nativeElement;
      let digits = input.value.replace(/\D/g, '').substring(0, 9);
  
      let formatted = '';
      if (digits.length > 0) {
        formatted += '(' + digits.substring(0, 2);
      }
      if (digits.length >= 3) {
        formatted += ') ' + digits.substring(2, 5);
      }
      if (digits.length >= 6) {
        formatted += '-' + digits.substring(5, 7);
      }
      if (digits.length >= 8) {
        formatted += '-' + digits.substring(7, 9);
      }
      input.value = formatted;
    }

}