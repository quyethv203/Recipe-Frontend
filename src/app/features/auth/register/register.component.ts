import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-wrap container">
      <div class="card auth-card">
        <h2>Đăng ký</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-field">
            <label>Tên đăng nhập</label>
            <input type="text" formControlName="username" autocomplete="username" />
          </div>
          <div class="form-field">
            <label>Email</label>
            <input type="email" formControlName="email" autocomplete="email" />
          </div>
          <div class="form-field">
            <label>Mật khẩu</label>
            <input type="password" formControlName="password" autocomplete="new-password" />
          </div>
          <p class="error-text" *ngIf="errorMessage()">{{ errorMessage() }}</p>
          <button type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Đang tạo tài khoản…' : 'Tạo tài khoản' }}
          </button>
        </form>
        <p class="hint">Đã có tài khoản? <a routerLink="/auth/login">Đăng nhập</a></p>
      </div>
    </div>
  `,
  styleUrl: '../auth.shared.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set(null);
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    });
  }
}
