import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, QueryList, signal, ViewChild, ViewChildren, WritableSignal } from '@angular/core';
import { CompaniesService } from '../../core/services/companies.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ICompany } from '../../core/models/company.model';
import { Menu } from "../../shared/components/menu/menu";
import { FormatPhonePipe } from "../../core/pipes/format-phone";
import { DayOfWeekPipe } from "../../core/pipes/day-of-week";
import { environment } from '../../../environments/environment';

const socialMediaIconsById: Record<number, {url: string, icon: string}> = {
  1: {url: 'https://instagram.com', icon: '/assets/social/instagram.svg'},
  2: {url: 'https://t.me', icon: '/assets/social/telegram.svg'},
  3: {url: 'https://wa.me', icon: '/assets/social/whatsapp.svg'},
  4: {url: 'https://facebook.com', icon: '/assets/social/facebook.svg'}
};

@Component({
  selector: 'mk-company-detail',
  imports: [CommonModule, Menu, FormatPhonePipe, DayOfWeekPipe],
  templateUrl: './company-detail.html',
  styleUrl: './company-detail.css',
})
export class CompanyDetail {
  @ViewChild('scrollCompanyRestImages') scrollCompanyRestImages: ElementRef<HTMLDivElement>;
  @ViewChildren('restImage') restImages: QueryList<ElementRef<HTMLImageElement>>;

  companyId: WritableSignal<number> = signal(null);
  company: WritableSignal<ICompany> = signal({});
  schedule: any = {};
  atLunch = signal(false);
  isWorking = signal(true);
  isClosed = signal(false);

  workingStatusLabel: string = '';

  isMainImageScrolling: boolean = false;
  isExpandedImageScrolling: boolean = false;
  expandImageIndex = 0;

  imageUrl = environment.imageUrl;
  expandedImageSrc: string;

  selectedImageId = signal(null);

  mainImagePath = computed(() => {
    const files = this.company()?.files ?? [];
    const selectedId = this.selectedImageId();
    
    if (files.length === 0) return null;
  
    const file = selectedId ? files.find(img => img.id === selectedId) : files[0];
  
    return file?.file_name ?? null;
  });

  readonly expandImage: WritableSignal<boolean> = signal(false);

  private companyService = inject(CompaniesService);
  private destroyRef = inject(DestroyRef);
  private activeRoute = inject(ActivatedRoute);
  
  constructor() {
    this.activeRoute.params.subscribe(params => {
      this.companyId.set(params['id']);
      this.getCompanyDetail();
    });
  }

  expandImageToView(path: string) {
    this.expandedImageSrc = `${this.imageUrl}/${path}`;
    this.expandImage.set(true);
    document.body.style.overflow = 'hidden';
  }

  swapMainImage(id: number, index: number) {
    this.selectedImageId.set(id)
    this.expandImageIndex = index;
    this.scrollToActiveRestImage(index);
  }

  closeExpandedImage() {
    document.body.style.overflow = 'auto';
    this.expandImage.set(false);
  }

  changeExpandedImage(evt) {
    const middle = evt.target.clientWidth / 2;
    const isLeft = evt.offsetX < middle;

    if(isLeft) {
      this.moveImageLeft();
    } else {
      this.moveImageRight()
    }
  }

  onExpandedImageScroll(event: WheelEvent) {
    event.preventDefault();

    if (this.isExpandedImageScrolling) return;
  
    this.isExpandedImageScrolling = true;

    if (event.deltaY < 0) {
      this.moveImageLeft();
    } else {
      this.moveImageRight();
    }
    setTimeout(() => this.isExpandedImageScrolling = false, 400);
  }

  onMainImageScroll(event: WheelEvent) {
    event.preventDefault();
    if (this.isMainImageScrolling) return;

    this.isMainImageScrolling = true;

    if (event.deltaY < 0) {
      this.moveImageLeft();
    } else {
      this.moveImageRight();
    }

    setTimeout(() => this.isMainImageScrolling = false, 400);
  }

  onMouseWheel(event: WheelEvent) {
    if (this.company().files.length > 2) {
      event.preventDefault();

      const container = this.scrollCompanyRestImages.nativeElement;

      container.scrollLeft += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    }
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
      console.log(company);
      
    })
  }

  private mapSocialMediaWithIcons(socialMedia: any[] = []): any[] {
    return socialMedia.map(sm => ({
      ...sm,
      icon: socialMediaIconsById[sm.social_media_id].icon,
      url: socialMediaIconsById[sm.social_media_id].url
    }));
  }

  private moveImageRight() {
    const images = this.company().files;
    this.expandImageIndex++;
    if (this.expandImageIndex < images.length) {
      this.expandedImageSrc = `${this.imageUrl}/${images[this.expandImageIndex].file_name}`;
    } else {
      this.expandImageIndex = 0;
      this.expandedImageSrc = `${this.imageUrl}/${images[this.expandImageIndex].file_name}`;
    }
    this.selectedImageId.set(images[this.expandImageIndex].id);
    this.scrollToActiveRestImage(this.expandImageIndex);
  }

  private moveImageLeft() {
    const images = this.company().files;
    if (this.expandImageIndex < images.length && this.expandImageIndex === 0) {
      this.expandImageIndex = images.length - 1;
      this.expandedImageSrc = `${this.imageUrl}/${images[this.expandImageIndex].file_name}`;
    } else {
      this.expandImageIndex--;
      this.expandedImageSrc = `${this.imageUrl}/${images[this.expandImageIndex].file_name}`;
    }
    this.selectedImageId.set(images[this.expandImageIndex].id);
    this.scrollToActiveRestImage(this.expandImageIndex);
  }

  private scrollToActiveRestImage(index: number) {
    const rest = this.restImages.get(index);

    if (rest) {
      rest.nativeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
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
