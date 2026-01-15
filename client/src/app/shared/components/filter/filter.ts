import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mk-filter',
  imports: [],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class Filter implements OnInit {

  id = input.required<number>();
  label = input.required<string>();
  filterRequestType = input.required<'category_ids' | 'tag_ids' | 'region_ids' | 'city_ids'>();

  checked: boolean = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const key = this.filterRequestType();
      const values = params[key] ? params[key].split(',').map(Number) : [];
      this.checked = values.includes(this.id());
    });
  }

  sendFilter(): void {
    const queryParams = { ...this.route.snapshot.queryParams };

    const key = this.filterRequestType();
    const currentValues = queryParams[key] ? queryParams[key].split(',').map(Number) : [];

    const isChecked = currentValues.includes(this.id());

    const updatedValues = isChecked ? currentValues.filter(v => v !== this.id()) : [...currentValues, this.id()];

    if (updatedValues.length > 0) {
      queryParams[key] = updatedValues.join(',');
    } else {
      delete queryParams[key];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams
    });
  }
}
