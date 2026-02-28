import { Component, input } from '@angular/core';

@Component({
  selector: 'mk-logo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class Logo {
  class = input<string>('');
  childClass = input<string>('text-(--bg-color)');
}
