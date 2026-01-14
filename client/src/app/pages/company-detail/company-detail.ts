import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CompaniesService } from '../../core/services/companies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ICompany } from '../../core/models/company.model';
import { Menu } from "../../shared/components/menu/menu";
import { FormatPhonePipe } from "../../core/pipes/format-phone";
import { DayOfWeekPipe } from "../../core/pipes/day-of-week";
import { TooltipDirective } from '../../core/directives/tooltip.directive';

const socialMediaIconsById: Record<number, string> = {
  1: '/assets/social/instagram.svg',
  2: '/assets/social/telegram.svg',
  3: '/assets/social/whatsapp.svg',
  4: '/assets/social/facebook.svg'
};

@Component({
  selector: 'mk-company-detail',
  imports: [CommonModule, Menu, FormatPhonePipe, DayOfWeekPipe],
  templateUrl: './company-detail.html',
  styleUrl: './company-detail.css',
})
export class CompanyDetail implements OnInit {

  companyId: WritableSignal<number> = signal(null);
  company: WritableSignal<ICompany> = signal({});
  schedule: any = {};
  atLunch = signal(false);
  isWorking = signal(true);
  isClosed = signal(false);

  workingStatusLabel: string = '';


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
      const company = {
        ...res.data,
        social_media: this.mapSocialMediaWithIcons(res.data.social_media)
      };
      this.company.set(company);
      this.schedule = company.schedules;
      this.calculateWorkingDay();
    })
  }

  private mapSocialMediaWithIcons(socialMedia: any[] = []): any[] {
    return socialMedia.map(sm => ({
      ...sm,
      icon: socialMediaIconsById[sm.social_media_id]
    }));
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
      this.workingStatus();
    }
  }

  private workingStatus(): string {
    if (this.atLunch()) {
      return this.workingStatusLabel = 'Обед';
    } else if (this.isWorking()) {
      return this.workingStatusLabel = `Открыто`;
    }
    return this.workingStatusLabel = `Закрыто`;
  }

}
