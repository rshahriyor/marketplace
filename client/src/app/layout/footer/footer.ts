import { Component } from '@angular/core';

interface IMenuItem {
  label?: string;
  id?: number;
  icon?: string;
  src?: string;
  routerLink?: string;
  linkType?: string;
  open?: boolean;
  children?: IMenuItem[]
}

@Component({
  selector: 'mk-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  menuListItems: IMenuItem[] = [
    {
      label: 'Оферта'
    },
    {
      label: 'Лицензия'
    },
    {
      label: 'Договоры'
    },
    {
      label: 'О платформе'
    }
  ]
  socialMediaListItems: IMenuItem[] = [
    {
      label: 'Instagram',
      icon: '/assets/social/instagram.svg',
      src: 'https://www.instagram.com/markets_tj.official?igsh=amZyc2YwMWpycjky'
    },
    {
      label: 'Facebook',
      icon: '/assets/social/facebook.svg'
    },
    {
      label: 'Telegram',
      icon: '/assets/social/telegram.svg',
      src: 'https://t.me/markets_tj_official_channel'
    },
    {
      label: 'WhatsApp',
      icon: '/assets/social/whatsapp.svg',
      src: 'https://wa.me/992115552555'
    }
  ]

}
