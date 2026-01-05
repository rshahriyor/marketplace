import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'mk-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menu = [
    { label: 'Аккаунт', icon: 'pi pi-user' },
    { label: 'Избранное', icon: 'pi pi-heart' }
  ]

  token: string | null = localStorage.getItem('token');

}
