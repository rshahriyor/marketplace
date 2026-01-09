import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'mk-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  form: FormGroup;
  isWrongCredentials: boolean = false;

  readonly loading: WritableSignal<boolean> = signal(false);

  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  ngOnInit(): void {
    this.createForm();
  }

  login(): void {
    if (this.form.invalid) {
      return;
    }

    const { username, password } = this.form.value;

    this.loading.set(true);

    this.authService.login(username, password)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe((res) => {
        if (res.code === 0) {
          this.router.navigate(['/']);
        }
        if (res.code === 401) {
          this.isWrongCredentials = true;
        }
      });
  }

  private createForm(): void {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

}
