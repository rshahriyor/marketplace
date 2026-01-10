import { Component, DestroyRef, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { IFilter } from '../../../core/models/filter.model';
import { FilterService } from '../../../core/services/filter.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'mk-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {

  currentPage = input.required<{name: string, icon: string}>();
  categories: WritableSignal<IFilter[]> = signal([]);

  private filterService = inject(FilterService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getCategories();
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
