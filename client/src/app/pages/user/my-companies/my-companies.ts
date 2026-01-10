import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CompaniesService } from '../../../core/services/companies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICompany } from '../../../core/models/company.model';
import { CompanyCard } from "../../../shared/components/company-card/company-card";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'mk-my-companies',
  imports: [CompanyCard, RouterLink],
  templateUrl: './my-companies.html',
  styleUrl: './my-companies.css',
})
export class MyCompanies implements OnInit {

  companiesList: WritableSignal<ICompany[]> = signal([]);

  private companyService = inject(CompaniesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getOwnCompanies();
  }

  private getOwnCompanies(): void {
    this.companyService.getOwnCompanies()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      this.companiesList.set(res);
    });
  }

}
