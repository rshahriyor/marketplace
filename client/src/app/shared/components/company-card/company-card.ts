import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, input, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TooltipDirective } from '../../../core/directives/tooltip.directive';
import { CompaniesService } from '../../../core/services/companies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StatusCodeEnum } from '../../../core/enums/status-code.enum';
import { AuthService } from '../../../core/services/auth.service';
import { ClickOutsideDirective } from "../../../core/directives/click-outside.directive";


export interface ISchedule {
  day_of_week?: number,
  start_at?: string,
  end_at?: string,
  lunch_start_at?: string,
  lunch_end_at?: string,
  is_working_day?: boolean,
  is_day_and_night?: boolean,
  without_breaks?: boolean
}

@Component({
  selector: 'mk-company-card',
  imports: [RouterLink, CommonModule, TooltipDirective, ClickOutsideDirective],
  templateUrl: './company-card.html',
  styleUrl: './company-card.css',
})
export class CompanyCard {

  companyId = input.required<number>();
  companyTitle = input.required<string>();
  companyIsFavorited = input.required<boolean>();
  companyFavoritesCount = input.required<number>();
  companyTags = input.required<any[]>();
  companyOwn = input<boolean>();
  companyIsActive = input<boolean>();
  
  cardImage = input<any[]>();


  atLunch = signal(false);
  isWorking = signal(true);
  isClosed = signal(false);
  showMenu = signal(false);

  get schedule(): Partial<ISchedule> {
    return this._value();
  }

  @Input() set schedule(value) {
    this._value.set(value);
    if (value) {
      this.calculateWorkingDay();
    }
  }

  readonly companyStatus: WritableSignal<boolean> = signal(false);
  readonly favoritesCount: WritableSignal<number> = signal(0);
  readonly isFavorite: WritableSignal<boolean> = signal(false);
  readonly addToFavoriteLoading: WritableSignal<boolean> = signal(false);
  readonly imageLoading: WritableSignal<boolean> = signal(true);

  private destroyRef = inject(DestroyRef);
  private companyService = inject(CompaniesService);
  private authService = inject(AuthService);
  private _value = signal<Partial<ISchedule>>({});

  get workingStatusLabel(): string {
    if (this.atLunch()) {
      return 'Обед';
    } else if (this.isWorking()) {
      return `Открыто до ${this.schedule.end_at.slice(0, 5)}`;
    }
    return `Закрыто до ${this.schedule.start_at.slice(0, 5)}`;
  }

  ngOnInit(): void {
    this.favoritesCount.set(this.companyFavoritesCount());
    this.isFavorite.set(this.companyIsFavorited());
    this.companyStatus.set(this.companyIsActive());
  }

  scheduleClick(evt: MouseEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
  }

  eventsClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }

  toggleFavoriteCard(): void {
    if (!this.authService.accessToken) {
      alert('Пожалуйста, войдите в систему, чтобы добавить в избранное.');
      return;
    }
    this.addToFavoriteLoading.set(true);
    this.companyService.toggleFavoriteCompany(this.companyId())
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      this.addToFavoriteLoading.set(false);
      if (res.status.code === StatusCodeEnum.SUCCESS) {
        this.isFavorite.set(!this.isFavorite());
        this.favoritesCount.update(prev => this.isFavorite() ? prev += 1 : prev -= 1);
      }
    })
  }

  updateCompanyStatus(): void {
    this.companyService.updateCompanyStatus(this.companyId(), !this.companyStatus())
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      if (res.status.code === StatusCodeEnum.SUCCESS) {
        this.companyStatus.set(!this.companyStatus());
      }
    })
  }

  private calculateWorkingDay(): void {
    const realTime = new Date();
    if (Array.isArray(this.schedule)) {
      this.schedule = this.schedule.find(schedule => schedule.day_of_week === realTime.getDay());
    }
    if (this.schedule.is_working_day) {
      const companyStartWork = new Date();
      const companyFinishWork = new Date();
      const lunchStartTime = new Date();
      const lunchEndTime = new Date();
      const realTime = new Date();

      let [hour, min] = this.schedule.start_at.split(':');
      companyStartWork.setHours(+hour, +min);

      [hour, min] = this.schedule.end_at.split(':');
      companyFinishWork.setHours(+hour, +min);

      if (this.schedule.lunch_start_at !== '') {
        const [h, m] = this.schedule.lunch_start_at.split(':');
        lunchStartTime.setHours(+h, +m);
      }

      if (this.schedule.lunch_end_at !== '') {
        const [h, m] = this.schedule.lunch_end_at.split(':');
        lunchEndTime.setHours(+h, +m);
      }

      if (realTime.getHours() > 4 && companyFinishWork.getHours() < 4) {
        companyFinishWork.setDate(companyFinishWork.getDate() + 1);
      } else if (realTime.getHours() < 4 && companyStartWork.getHours() > 4 && companyFinishWork.getHours() < 4 && realTime.getHours() < companyFinishWork.getHours()) {
        companyStartWork.setDate(companyStartWork.getDate() - 1);
      }

      this.isWorking.set((realTime >= companyStartWork && realTime < companyFinishWork || !!this.schedule.is_day_and_night));
      this.atLunch.set(realTime >= lunchStartTime && realTime < lunchEndTime);

      const isClosed = this.isWorking() || this.atLunch();
      this.isClosed.set(!isClosed);
    }
  }

}
