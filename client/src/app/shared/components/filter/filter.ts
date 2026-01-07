import { Component, inject, input } from '@angular/core';
import { FilterService } from '../../../core/services/filter.service';
import { IFilterRequest } from '../../../core/models/filter.model';

@Component({
  selector: 'mk-filter',
  imports: [],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class Filter {

  id = input.required<number>();
  label = input.required<string>();
  filterRequestType = input.required<'category_ids' | 'tag_ids' | 'region_ids' | 'city_ids'>();

  checked: boolean = false;

  private filterService = inject(FilterService);

  sendFilter(): void {
    this.checked = !this.checked;

    const currentFilter = this.filterService.filter.value;

    const updatedFilter: IFilterRequest = {
      ...currentFilter,
      [this.filterRequestType()]: this.checked
        ? [...currentFilter[this.filterRequestType()], this.id()]
        : currentFilter[this.filterRequestType()].filter(v => v !== this.id())
    };

    this.filterService.filter.next(updatedFilter);
  }
}
