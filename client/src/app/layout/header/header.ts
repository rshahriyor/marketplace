import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { debounceTime, filter, finalize, switchMap } from 'rxjs';
import { CompaniesService } from '../../core/services/companies.service';
import { ICompany } from '../../core/models/company.model';
import { NgTemplateOutlet } from '@angular/common';
import { ClickOutsideDirective } from "../../core/directives/click-outside.directive";
import { Logo } from "../../shared/components/logo/logo";

@Component({
  selector: 'mk-header',
  imports: [RouterLink, ReactiveFormsModule, NgTemplateOutlet, ClickOutsideDirective, Logo],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{
  menu = [
    { label: 'Аккаунт', icon: 'pi pi-user' },
    { label: 'Избранное', icon: 'pi pi-heart' }
  ]

  token: string | null = localStorage.getItem('token');
  searchFormControl = new FormControl<string>('');
  searchData: WritableSignal<ICompany[]> = signal([]);
  showSearchDropdown: WritableSignal<boolean> = signal(false);

  private companyService = inject(CompaniesService);

  ngOnInit(): void {
    this.handleSearchData();
  }

  private handleSearchData() {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(750),
        filter((value) => !!value),
        switchMap((value) => {
          return this.companyService.searchCompanies(value)
        }),
      ).subscribe((res) => {
      this.searchData.set(res.data);
    })
  }

}
