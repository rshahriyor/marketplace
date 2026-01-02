import { Component } from '@angular/core';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'mk-main-layout',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
