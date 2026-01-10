import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { FilterService } from '../../../../core/services/filter.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CompaniesService } from '../../../../core/services/companies.service';

@Component({
  selector: 'mk-company-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, Dropdown],
  templateUrl: './company-form.html',
  styleUrl: './company-form.css',
})
export class CompanyForm implements OnInit {

  form: FormGroup;

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

  isAllSelectedTag = false;
  tagOptions = [];

  private tagOptionsClone = [];

  private fb = inject(FormBuilder);
  private companyService = inject(CompaniesService);
  private filterService = inject(FilterService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.createForm();
    this.getCategoryOptions();
    this.getCityOptions();
    this.getRegionOptions();
    this.getTagOptions();
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;

    this.companyService.addCompany(formData)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        console.log('Company added successfully:', res);
      });

    console.log('Form Data:', formData);
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

  private createForm(): void {
    this.form = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      category_id: new FormControl(null, [Validators.required]),
      tag_id: new FormControl([]),
      phone_number: new FormControl(null),
      // image_paths: new FormControl(),
      // working_days: new FormControl(),
      // day_break: new FormControl(),
      region_id: new FormControl(null, [Validators.required]),
      city_id: new FormControl(null, [Validators.required]),
      address: new FormControl('', [Validators.required]),
      longitude: new FormControl(null, [Validators.required]),
      latitude: new FormControl(null, [Validators.required]),
      desc: new FormControl('', [Validators.required])
      // lunch_start_at: new FormControl('12:00'),
      // lunch_end_at: new FormControl('13:00'),
      // schedule: this.fb.array(this.weekDays.map((_, index) => {
      //   return this.fb.group({
      //     start_at: new FormControl('08:00'),
      //     end_at: new FormControl('17:00'),
      //     lunch_start_at: new FormControl(),
      //     lunch_end_at: new FormControl(),
      //     is_day_and_night: new FormControl(),
      //     is_work_day: new FormControl(),
      //     without_interruption: new FormControl()
      //   })
      // })),
      // social_media_address: this.fb.array(
      //   this.socialMediaList.map(() => {
      //     return this.fb.group({
      //       name: new FormControl(),
      //       address: new FormControl()
      //     })
      //   })
      // ),
    });
  }

}
