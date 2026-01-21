import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Filter } from "../../shared/components/filter/filter";
import { CompanyCard } from "../../shared/components/company-card/company-card";
import { CompaniesService } from '../../core/services/companies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICompany } from '../../core/models/company.model';
import { IFilter, IFilterRequest } from '../../core/models/filter.model';
import { FilterService } from '../../core/services/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mk-company-filter',
  imports: [Filter, CompanyCard, ReactiveFormsModule, CommonModule],
  templateUrl: './company-filter.html',
  styleUrl: './company-filter.css',
})
export class CompanyFilter implements OnInit {

  companiesList: WritableSignal<ICompany[]> = signal([]);

  categories: WritableSignal<IFilter[]> = signal([]);
  categoriesClone: WritableSignal<IFilter[]> = signal([]);

  tags: WritableSignal<IFilter[]> = signal([]);
  tagsClone: WritableSignal<IFilter[]> = signal([]);

  regions: WritableSignal<IFilter[]> = signal([]);
  regionsClone: WritableSignal<IFilter[]> = signal([]);

  cities: WritableSignal<IFilter[]> = signal([]);
  citiesClone: WritableSignal<IFilter[]> = signal([]);

  filterRequest: IFilterRequest = {
    category_ids: [],
    tag_ids: [],
    region_ids: [],
    city_ids: [],
    is_favorite: false
  };
  showAllFilter: { companyCategory: boolean, companyTag: boolean, city: boolean, region: boolean } = {
    companyCategory: false,
    companyTag: false,
    city: false,
    region: false
  };

  categoriesFormControl = new FormControl('');
  tagsFormControl = new FormControl('');
  regionsFormControl = new FormControl('');
  citiesFormControl = new FormControl('');

  private companyService = inject(CompaniesService);
  private filterService = inject(FilterService);
  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

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
    this.handleSearchFilter();
  }

  toggleSelectAll(event: Event, type: 'category_ids' | 'tag_ids' | 'region_ids' | 'city_ids'): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    const queryParams = { ...this.activatedRoute.snapshot.queryParams };

    if (isChecked) {
      const ids = this.getIdsByType(type);
      queryParams[type] = ids.join(',');
    } else {
      delete queryParams[type];
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams
    });
  }

  loadFilterWithoutLimit(type: 'company_categories' | 'company_tags' | 'regions' | 'cities') {
    switch (type) {
      case 'company_categories':
        this.showAllFilter.companyCategory = !this.showAllFilter.companyCategory;
          break;
      case 'company_tags':
        this.showAllFilter.companyTag = !this.showAllFilter.companyTag;
        break;
      case 'regions':
        this.showAllFilter.region = !this.showAllFilter.region;
        break;
      case 'cities':
        this.showAllFilter.city = !this.showAllFilter.city;
        break;
      default:
    }
  }

  private getIdsByType(type: 'category_ids' | 'tag_ids' | 'region_ids' | 'city_ids'): number[] {
    switch (type) {
      case 'category_ids':
        return this.categories().map(c => c.id!);
      case 'tag_ids':
        return this.tags().map(t => t.id!);
      case 'region_ids':
        return this.regions().map(r => r.id!);
      case 'city_ids':
        return this.cities().map(c => c.id!);
    }
  }

  private handleSearchFilter(): void {
    this.categoriesFormControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.categories.set(this.categoriesClone().filter(category => category.name.toLowerCase().includes(res.toLowerCase())));
      });

    this.tagsFormControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.tags.set(this.tagsClone().filter(tag => tag.name.toLowerCase().includes(res.toLowerCase())));
      });

    this.regionsFormControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.regions.set(this.regionsClone().filter(region => region.name.toLowerCase().includes(res.toLowerCase())));
      });

    this.citiesFormControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.cities.set(this.citiesClone().filter(city => city.name.toLowerCase().includes(res.toLowerCase())));
      });
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
        this.categoriesClone.set(res.data);
      })
  }

  private getTags(): void {
    this.filterService.getTags()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.tags.set(res.data);
        this.tagsClone.set(res.data);
      })
  }

  private getRegions(): void {
    this.filterService.getRegions()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.regions.set(res.data);
        this.regionsClone.set(res.data);
      })
  }

  private getCities(): void {
    this.filterService.getCities()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.cities.set(res.data);
        this.citiesClone.set(res.data);
      })
  }

}
