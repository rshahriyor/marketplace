import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, inject, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../core/directives/click-outside.directive';

export type DropdownType = {
  name: string
  value: any
}

const VALUE_ACCESSOR_PROVIDERS = [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Dropdown),
    multi: true
  },
  {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => Dropdown),
      multi: true,
  },
]

@Component({
  selector: 'mk-dropdown',
  imports: [CommonModule, ReactiveFormsModule, ClickOutsideDirective],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
  providers: VALUE_ACCESSOR_PROVIDERS,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dropdown implements OnInit {
  @ViewChildren('itemsList') itemsList: QueryList<ElementRef>;

  @Input() showFilter: boolean;
  @Input() optionValue: string;
  @Input() optionLabel: string;
  @Input() required?: boolean;
  @Input() labelStyle?: string;
  @Input() iconStyle?: string;
  @Input() dropdownStyle?: string;
  @Input() optionIcon?: boolean;

  dropdownOptions: DropdownType[] = [];
  searchFormControl = new FormControl();

  private _cdr = inject(ChangeDetectorRef)
  private _optionsClone: DropdownType[] = [];

  value: DropdownType = null;
  disabled = false;
  menuVisible = false;
  selectedDropdownLables = [];
  isValid = false;

  @Input() set options(options: DropdownType[]) {
     this.dropdownOptions = options;
     this._optionsClone = options.slice();
  }

  ngOnInit(): void {
    this._handleSearch()
  }

  openMenu() {
   this.menuVisible = !this.menuVisible;
   if (this.menuVisible) this.scrollToActivePosition();
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: string | boolean | number | null): void {
    this.value = value !== null && this.dropdownOptions.find((option) => option[this.optionValue] === value) || null;
    this._cdr.markForCheck()
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleChangeValue(option: DropdownType): void {
    this.menuVisible = false;
    if (!this.disabled) {
      this.value = option
      this.onChange(option[this.optionValue]);
      this.onTouched();
    }
  }

  validate(control: FormControl) {
    this.isValid = this.required ? control.value !== null : true
  }

  private _handleSearch() {
     this.searchFormControl.valueChanges
     .subscribe((searchTerm) => {
      const lowerSearchTerm = searchTerm.toLowerCase();

    if (!lowerSearchTerm.trim().length) {
      this.dropdownOptions = this._optionsClone
      this._cdr.markForCheck()
      return;
    }

      this.dropdownOptions = this._optionsClone;
      this.dropdownOptions = this.dropdownOptions.filter((option) => option[this.optionLabel].toLowerCase().includes(lowerSearchTerm));
  })
  }

  private scrollToActivePosition() {
    setTimeout(() => {
      const activeEl = this.itemsList.find(el =>
        el.nativeElement.classList.contains('active')
      );
    
      if (activeEl) {
        activeEl.nativeElement.scrollIntoView({
          behavior: 'auto',
          block: 'center'
        });
      }
    });
  }
}
