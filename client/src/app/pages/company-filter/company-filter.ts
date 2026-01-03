import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Filter } from "../../shared/components/filter/filter";
import { CompanyCard } from "../../shared/components/company-card/company-card";
import { CompaniesService } from '../../core/services/companies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'mk-company-filter',
  imports: [Filter, CompanyCard],
  templateUrl: './company-filter.html',
  styleUrl: './company-filter.css',
})
export class CompanyFilter implements OnInit {

  companies: WritableSignal<any[]> = signal([]);

  private companyService = inject(CompaniesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getCompanies();
  }

  private getCompanies(): void {
    this.companyService.getCompaniesByCategory()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      this.companies.set(res);
    })
  }

}
