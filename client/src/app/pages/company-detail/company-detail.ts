import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CompaniesService } from '../../core/services/companies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ICompany } from '../../core/models/company.model';
import { Menu } from "../../shared/components/menu/menu";

@Component({
  selector: 'mk-company-detail',
  imports: [CommonModule, Menu],
  templateUrl: './company-detail.html',
  styleUrl: './company-detail.css',
})
export class CompanyDetail implements OnInit {

  companyId: WritableSignal<number> = signal(null);
  company: WritableSignal<ICompany> = signal({});

  private companyService = inject(CompaniesService);
  private destroyRef = inject(DestroyRef);
  private activeRoute = inject(ActivatedRoute);
  
  constructor() {
    const { id } = this.activeRoute.snapshot.params;
    this.companyId.set(id);
  }

  ngOnInit(): void {
    this.getCompanyDetail();
  }

  private getCompanyDetail(): void {
    this.companyService.getCompanyDetail(this.companyId())
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      this.company.set(res);
    })
  }

}
