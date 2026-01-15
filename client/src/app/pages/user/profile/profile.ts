import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IUser } from '../../../core/models/user.model';
import { StatusCodeEnum } from '../../../core/enums/status-code.enum';
import { PhoneMaskDirective } from "../../../core/directives/phone-mask.directive";
import { formatPhone } from '../../../core/utils/helper';

@Component({
  selector: 'mk-profile',
  imports: [ReactiveFormsModule, PhoneMaskDirective],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  editing: WritableSignal<boolean> = signal(false);
  originalProfileInfo: WritableSignal<IUser> = signal({} as IUser);
  profileForm: FormGroup;

  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.createForm();
    this.getProfileData();
  }

  edit(): void {
    this.editing.set(true);
    this.profileForm.get('gender_id')?.enable();
  }

  cancelEdit(): void {
    this.editing.set(false);
    this.profileForm.get('gender_id')?.disable();
    this.profileForm.patchValue({ ...this.originalProfileInfo() }, { emitEvent: false });
  }

  save(): void {
    // this.addLoading.set(true);

    // const value = { ...this.profileForm.value };
    // value.gender = Boolean(value.gender);
    // const phone = '992' + value.phone_number.replace(/[()\-\s]/g, '').substring(0, 9)
    // value.phone_number = Number(phone);

    // this.service.updateProfile(value)
    //   .pipe(
    //     finalize(() => this.addLoading.set(false)),
    //     takeUntilDestroyed(this.destroyRef)
    //   )
    //   .subscribe((res) => {
    //     if (res.status.code === StatusCodeEnum.SUCCESS) {
    //       this.toastService.showToast('success', 'Вы успешно обновили свой профиль');
    //       this.editing.set(false);
    //       this.profileForm.get('gender')?.disable();
    //     }
    //     if (res.status.code === StatusCodeEnum.UNKNOWN_ERROR) {
    //       this.toastService.showToast('error', res.status.message);
    //     }
    //     if (res.status.code === StatusCodeEnum.PHONE_NUMBER_ERROR) {
    //       this.toastService.showToast('error', res.status.message);
    //     }
    //   })
  }

  private getProfileData(): void {
    this.userService.getProfile()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((res) => {
      if (res.status.code === StatusCodeEnum.SUCCESS) {
        this.originalProfileInfo.set(res.data);

        if (res.data.phone_number) {
          const phone = res.data.phone_number;
          res.data.phone_number = formatPhone(phone.toString());
        }

        if (!this.editing()) {
          this.profileForm.get('gender_id')?.disable();
        } else {
          this.profileForm.get('gender_id')?.enable();
        }

        this.profileForm.patchValue(res.data);
      }
    })
  }

  private createForm(): void {
    this.profileForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      gender_id: new FormControl(null, [Validators.required]),
      phone_number: new FormControl('', [Validators.required])
    })
  }

}
