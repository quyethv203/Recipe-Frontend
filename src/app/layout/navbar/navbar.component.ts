import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="navbar">
      <div class="container nav-inner">
        <a routerLink="/" class="brand">
          <span class="logo">RS</span>
          <span class="brand-text">Recipe Social</span>
        </a>
        <nav class="nav-links">
          <a routerLink="/recipes" routerLinkActive="active">Công thức</a>
          <a routerLink="/favorites" routerLinkActive="active" *ngIf="isLoggedIn()">Yêu thích</a>
          <a routerLink="/meal-planner" routerLinkActive="active" *ngIf="isLoggedIn()">Lịch nấu</a>
          <a routerLink="/shopping-list" routerLinkActive="active" *ngIf="isLoggedIn()">Đi chợ</a>
        </nav>
        <div class="nav-actions">
          <ng-container *ngIf="isLoggedIn(); else guestActions">
            <span class="hello">Xin chào, <strong>{{ username() }}</strong></span>
            <button class="btn-secondary" (click)="logout()">Đăng xuất</button>
          </ng-container>
          <ng-template #guestActions>
            <a routerLink="/auth/login"><button class="btn-secondary">Đăng nhập</button></a>
            <a routerLink="/auth/register"><button>Đăng ký</button></a>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getAccessToken();
  }

  username(): string {
    return this.tokenStorage.getUser()?.username ?? '';
  }

  logout(): void {
    this.tokenStorage.clear();
    this.router.navigate(['/']);
  }
}
