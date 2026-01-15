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
export class CompanyFilter implements OnInit {

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
        this.filterRequest = {
          category_ids: params['category_ids'] ? params['category_ids'].split(',').map(Number) : [],
          tag_ids: params['tag_ids'] ? params['tag_ids'].split(',').map(Number) : [],
          region_ids: params['region_ids'] ? params['region_ids'].split(',').map(Number) : [],
          city_ids: params['city_ids'] ? params['city_ids'].split(',').map(Number) : [],
          is_favorite: params['is_favorite']
        }
        this.getCompanies();
      });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getTags();
    this.getRegions();
    this.getCities();
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
