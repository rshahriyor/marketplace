import { Component, DestroyRef, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Filter } from "../../shared/components/filter/filter";
import { CompanyCard } from "../../shared/components/company-card/company-card";
import { CompaniesService } from '../../core/services/companies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICompany } from '../../core/models/company.model';
import { IFilter, IFilterRequest } from '../../core/models/filter.model';
import { FilterService } from '../../core/services/filter.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mk-company-filter',
  imports: [Filter, CompanyCard],
  templateUrl: './company-filter.html',
  styleUrl: './company-filter.css',
})
export class CompanyFilter implements OnInit, OnDestroy {

  companiesList: WritableSignal<ICompany[]> = signal([]);
  categories: WritableSignal<IFilter[]> = signal([]);
  tags: WritableSignal<IFilter[]> = signal([]);
  regions: WritableSignal<IFilter[]> = signal([]);
  cities: WritableSignal<IFilter[]> = signal([]);

  filterRequest: IFilterRequest = {
    category_ids: [],
    tag_ids: [],
    region_ids: [],
    city_ids: [],
    is_favorite: false
  }

  isFavoriteRoute: WritableSignal<boolean> = signal(false);

  private isDestoyed: boolean = false;
  private companyService = inject(CompaniesService);
  private filterService = inject(FilterService);
  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.activatedRoute.queryParams
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((params) => {
      const is_favorite = params['is_favorite'];
      this.isFavoriteRoute.set(is_favorite);
      this.getFilteredCompanies();
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getTags();
    this.getRegions();
    this.getCities();
  }

  ngOnDestroy(): void {
    this.isDestoyed = true;
    this.filterService.filter.next({
      category_ids: [],
      tag_ids: [],
      region_ids: [],
      city_ids: [],
      is_favorite: false
    });
  }

  private getFilteredCompanies(): void {
    this.filterService.filter
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      if (this.isDestoyed) return;
      this.filterRequest = res;
      if (this.isFavoriteRoute()) {
        this.filterRequest.is_favorite = true;
      }
      this.getCompanies();
    })
  }

  private getCompanies(): void {
    this.companyService.getCompaniesByFilter(this.filterRequest)
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      this.companiesList.set(res.data);
    })
  }

  private getCategories(): void {
    this.filterService.getCategories()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      this.categories.set(res.data);
    })
  }

  private getTags(): void {
    this.filterService.getTags()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      this.tags.set(res.data);
    })
  }

  private getRegions(): void {
    this.filterService.getRegions()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      this.regions.set(res.data);
    })
  }

  private getCities(): void {
    this.filterService.getCities()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      this.cities.set(res.data);
    })
  }

}
