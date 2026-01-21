import { Component, DestroyRef, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { IFilter } from '../../../core/models/filter.model';
import { FilterService } from '../../../core/services/filter.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mk-menu',
  imports: [RouterLink, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {

  currentPage = input.required<{name: string, icon: string}>();
  categories: WritableSignal<IFilter[]> = signal([]);

  categoryListCount: number = 5;
  isShowFullCategoryList: boolean = false;

  private filterService = inject(FilterService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getCategories();
  }

  showMoreCategoryList() {
    if (this.isShowFullCategoryList) {
      this.isShowFullCategoryList = false;
      this.categoryListCount = 5;
    } else {
      this.isShowFullCategoryList = true;
      this.categoryListCount = this.categories().length;
    }
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

}
