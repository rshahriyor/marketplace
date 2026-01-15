import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { FilterService } from '../../../../core/services/filter.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CompaniesService } from '../../../../core/services/companies.service';
import { DAYS_OFF_STATUS, WEEK_DAYS } from '../../../../core/utils/constants';
import { getTimeSlots } from '../../../../core/utils/helper';
import { PhoneMaskDirective } from "../../../../core/directives/phone-mask.directive";

@Component({
  selector: 'mk-company-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, Dropdown, PhoneMaskDirective],
  templateUrl: './company-form.html',
  styleUrl: './company-form.css',
})
export class CompanyForm implements OnInit {

  form: FormGroup;

  companyId: WritableSignal<number> = signal(null);
  regionOptions: WritableSignal<any[]> = signal([]);
  cityOptions: WritableSignal<any[]> = signal([]);
  categoryOptions: WritableSignal<any[]> = signal([]);

  dropdownMenuState = {
    categoryMenuVisible: false,
    tagsMenuVisible: false
  };
  dropdownSelectedLabelMap = {
    category: [],
    tags: []
  };
  timeSlots = getTimeSlots();


  isAllSelectedTag = false;
  tagOptions = [];
  weekDays = WEEK_DAYS;
  scheduleStartTimeSlots = [{ name: 'Выходной', value: 'Выходной' }, { name: 'Круглосуточно', value: 'Круглосуточно' }, ...this.timeSlots];
  lunchTimeSlots = [{ name: 'Без перерыва', value: 'Без перерыва' }, ...this.timeSlots];
  socialMediaList = [
    {
      id: 1,
      name: 'Instagram'
    },
    {
      id: 2,
      name: 'Facebook'
    },
    {
      id: 3,
      name: 'Telegram'
    },
    {
      id: 4,
      name: 'WhatsApp'
    }
  ];
  socialMediaOptions = this.socialMediaList.map((sm) => ({ value: sm.id, name: sm.name }));

  private tagOptionsClone = [];

  private fb = inject(FormBuilder);
  private companyService = inject(CompaniesService);
  private activatedRoute = inject(ActivatedRoute);
  private filterService = inject(FilterService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  constructor() {
    const { id } = this.activatedRoute.snapshot.params;
    if (id) {
      this.companyId.set(id);
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.getCategoryOptions();
    this.getCityOptions();
    this.getRegionOptions();
    this.getTagOptions();
    if (this.companyId()) {
      this.getCompanyDetail();
    }
  }

  get scheduleArray(): FormArray {
    return this.form.get('schedules') as FormArray;
  }

  get socialMediaAddress(): FormArray {
    return this.form.get('social_media') as FormArray;
  }

  toggleDropdown(type: string): void {

    const menuKeys = Object.keys(this.dropdownMenuState);

    const resetMenuVisible = (exceptKey: string) => menuKeys.forEach((key) => key !== exceptKey && (this.dropdownMenuState[key] = false));

    switch (type) {
      case 'category':
        resetMenuVisible("categoryMenuVisible")
        this.dropdownMenuState.categoryMenuVisible = !this.dropdownMenuState.categoryMenuVisible;
        break;

      case 'tags':
        resetMenuVisible("tagsMenuVisible")
        this.dropdownMenuState.tagsMenuVisible = !this.dropdownMenuState.tagsMenuVisible;
        break;

      default:
        break;
    }
  }

  toggleSelectAll(event): void {
    const checked = (event.target as HTMLInputElement).checked;
    // const data = this.tagOptions.map((ctg) => ctg.tags).flatMap((child) => child);
    const data = this.tagOptions.map((ctg) => ctg);
    let previousValue = this.form.get(`tag_id`)?.value || [];
    if (checked) {
      this.dropdownSelectedLabelMap.tags = data.map(tag => tag.name);
      previousValue = data.map(tag => tag.id);
    } else {
      this.dropdownSelectedLabelMap.tags = [];
      previousValue = [];
    }

    // this.isAllSelectedTag = this.tagOptionsClone.filter((obj) => obj.children).every((ctg) => ctg.children.every((child) => this.dropdownSelectedLabelMap.tags.includes(child.name)));
    this.isAllSelectedTag = this.tagOptionsClone.every((tag) => this.dropdownSelectedLabelMap.tags.includes(tag.name));

    this.form.get(`tag_id`)?.setValue(previousValue);
  }

  handleTagSearchOptions(searchTerm: string): void {
    this.tagOptions = this.tagOptionsClone.slice();

    const lowerSearchTerm = searchTerm.toLowerCase();
    const result = [];

    if (!lowerSearchTerm.trim().length) {
      this.tagOptions = this.tagOptionsClone;
      return;
    }

    // this.tagOptions.forEach(category => {
    //   const matchTag = category.tags.filter(tag => tag.name.toLowerCase().includes(lowerSearchTerm));

    //   const isCategoryMatch = category.company_category_name?.toLowerCase().includes(lowerSearchTerm);

    //   if (isCategoryMatch || matchTag.length > 0) {
    //     result.push({
    //       ...category,
    //       tags: isCategoryMatch ? category.tags : matchTag
    //     });
    //   }
    // });

    this.tagOptions.forEach(tag => {
      const matchTag = tag.name.toLowerCase().includes(lowerSearchTerm);

      if (matchTag) {
        result.push({
          ...tag,
          tags: matchTag
        });
      }
    });

    this.tagOptions = result;
  }

  handleCheckBoxChange(tag: any): void {
    const optionList = this.dropdownSelectedLabelMap.tags;
    const previousValue = this.form.get(`tag_id`)?.value || [];
    const exist = optionList.indexOf(tag.name);
    if (exist > -1) {
      optionList.splice(exist, 1);
      previousValue.splice(previousValue.indexOf(tag.id), 1);
    } else {
      optionList.push(tag.name);
      previousValue.push(tag.id);
    }

    // this.isAllSelectedTag = this.tagOptionsClone.every((ctg) => ctg.children?.every((child) => optionList.includes(child.name)));
    this.isAllSelectedTag = this.tagOptionsClone.every((tag) => optionList.includes(tag.name));

    this.form.get(`tag_id`)?.setValue(previousValue);
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  addCompany(): void {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }

    const rawValue = this.form.getRawValue();
    const { schedules, lunch_start_at, lunch_end_at, ...rest } = rawValue;

    const social_media = (rawValue.social_media || []).filter(
      sm => sm.social_media_id && sm.account_url
    );

    const company_schedule = schedules.map((value, index) => {
      const is_working_day = value.start_at !== DAYS_OFF_STATUS[0];
      const is_day_and_night = value.start_at === DAYS_OFF_STATUS[1];
      const without_breaks = lunch_start_at === DAYS_OFF_STATUS[2]; 
    
      let start_at = value.start_at;
      let end_at = value.end_at;
    
      if (!is_working_day || is_day_and_night) {
        start_at = '00:00';
        end_at = '23:59';
      }
    
      return {
        day_of_week: index + 1,
        start_at,
        end_at,
        is_working_day,
        is_day_and_night,
        without_breaks,
        lunch_start_at: without_breaks ? null : lunch_start_at,
        lunch_end_at: without_breaks ? null : lunch_end_at
      };
    });

    const payload = {
      ...rest,
      schedules: company_schedule,
      social_media
    };

    if (this.companyId() !== null) {
      this.companyService.updateCompany(this.companyId(), payload)
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((res) => {
          console.log('Company updated successfully:', res);
          this.router.navigate(['/u/m-c']);
        });
    } else {
      this.companyService.addCompany(payload)
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((res) => {
          console.log('Company added successfully:', res);
          this.router.navigate(['/u/m-c']);
        });
    }
  }

  private getRegionOptions(): void {
    this.filterService.getRegions()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.regionOptions.set(res.data);
      });
  }

  private getCityOptions(): void {
    this.filterService.getCities()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.cityOptions.set(res.data);
      });
  }

  private getCategoryOptions(): void {
    this.filterService.getCategories()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.categoryOptions.set(res.data);
      });
  }

  private getTagOptions(): void {
    this.filterService.getTags()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.tagOptions = res.data;
        this.tagOptionsClone = res.data.slice();
      });
  }

  private getCompanyDetail(): void {
    this.companyService.getCompanyDetail(this.companyId())
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        const company = res.data;

        this.form.patchValue({
          name: company.name,
          category_id: company.category_id,
          phone_number: company.phone_number,
          region_id: company.region_id,
          city_id: company.city_id,
          address: company.address,
          longitude: company.longitude,
          latitude: company.latitude,
          desc: company.desc
        });

        company.tags.forEach((tag) => {
          this.handleCheckBoxChange({ ...tag, id: tag.tag_id, name: tag.tag_name });
        })

        const { lunch_start_at, lunch_end_at, without_breaks } = company.schedules[0]
        const formatTime = (time: string) => time.split(':').slice(0, 2).join(':')

        if (!without_breaks) {
          this.form.get('lunch_start_at').patchValue(formatTime(lunch_start_at))
          this.form.get('lunch_end_at').patchValue(formatTime(lunch_end_at))
        } else {
          this.form.get('lunch_start_at').patchValue(DAYS_OFF_STATUS[2])
        }

        if (company.schedules && Array.isArray(company.schedules)) {
          const schedulesArray = this.scheduleArray;
          company.schedules.forEach((schedule, index) => {
            if (schedulesArray.at(index)) {
              schedulesArray.at(index).patchValue({
                start_at: schedule.start_at,
                end_at: schedule.end_at,
                lunch_start_at: schedule.lunch_start_at,
                lunch_end_at: schedule.lunch_end_at,
                is_working_day: schedule.is_working_day,
                is_day_and_night: schedule.is_day_and_night,
                without_breaks: schedule.without_breaks
              });
            }
          });
        }

        if (company.social_media && Array.isArray(company.social_media)) {
          const socialMediaArray = this.socialMediaAddress;
          company.social_media.forEach((sm, index) => {
            if (socialMediaArray.at(index)) {
              socialMediaArray.at(index).patchValue({
                social_media_id: sm.social_media_id,
                account_url: sm.account_url
              });
            }
          });
        }
      });
  }

  private createForm(): void {
    this.form = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      category_id: new FormControl(null, [Validators.required]),
      tag_id: new FormControl([]),
      phone_number: new FormControl(null),
      // image_paths: new FormControl(),
      region_id: new FormControl(null, [Validators.required]),
      city_id: new FormControl(null, [Validators.required]),
      address: new FormControl('', [Validators.required]),
      longitude: new FormControl(null, [Validators.required]),
      latitude: new FormControl(null, [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      schedules: this.fb.array(this.weekDays.map((_, index) => {
        return this.fb.group({
          start_at: new FormControl('08:00'),
          end_at: new FormControl('17:00'),
          lunch_start_at: new FormControl(),
          lunch_end_at: new FormControl(),
          is_working_day: new FormControl(),
          is_day_and_night: new FormControl(),
          without_breaks: new FormControl()
        })
      })),
      lunch_start_at: new FormControl('12:00'),
      lunch_end_at: new FormControl('13:00'),
      social_media: this.fb.array(
        this.socialMediaList.map(() => {
          return this.fb.group({
            social_media_id: new FormControl(),
            account_url: new FormControl()
          })
        })
      ),
    });
  }

}
