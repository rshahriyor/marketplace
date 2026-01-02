import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CompanyCard } from "../../shared/components/company-card/company-card";
import { CompaniesService } from '../../core/services/companies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

export interface ICompany {
  id?: number,
  name?: string,
  image?: string,
  tags?: string[],
  is_favorited?: boolean,
  favorites_count?: number,
  categories?: string[],
}

export interface ICompaniesResponseForMainPage {
  companies: ICompany[],
  category_id: number,
  category_name: string
}

@Component({
  selector: 'mk-home',
  imports: [CompanyCard, RouterLink, NgTemplateOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  companiesList: WritableSignal<ICompaniesResponseForMainPage[]> = signal([]);

  private companyService = inject(CompaniesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getCompanies();
  }

  private getCompanies(): void {
    this.companyService.getCompaniesForMainPage()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      this.companiesList.set(res);
    })
  }

}
