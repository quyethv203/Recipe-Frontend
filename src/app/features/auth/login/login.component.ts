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
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-wrap container">
      <div class="card auth-card">
        <h2>Đăng nhập</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-field">
            <label>Tên đăng nhập hoặc Email</label>
            <input type="text" formControlName="usernameOrEmail" autocomplete="username" />
          </div>
          <div class="form-field">
            <label>Mật khẩu</label>
            <input type="password" formControlName="password" autocomplete="current-password" />
          </div>
          <p class="error-text" *ngIf="errorMessage()">{{ errorMessage() }}</p>
          <button type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Đang đăng nhập…' : 'Đăng nhập' }}
          </button>
        </form>
        <p class="hint">Chưa có tài khoản? <a routerLink="/auth/register">Đăng ký</a></p>
      </div>
    </div>
  `,
  styleUrl: '../auth.shared.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    usernameOrEmail: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set(null);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
      }
    });
  }
}
