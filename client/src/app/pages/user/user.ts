import { Component, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'mk-user',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {

  menuItems: WritableSignal<any[]> = signal([
    {
      id: 1,
      label: 'Мои заведения',
      icon: 'pi pi-building',
      route: '/u/m-c'
    },
    {
      id: 2,
      label: 'Профиль',
      icon: 'pi pi-user',
      route: '/u/p'
    }
  ])

}
