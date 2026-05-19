import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from './favorites.service';
import { RecipeSummary } from '../../core/models/recipe.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container">
      <h2>Công thức yêu thích</h2>
      <p *ngIf="loading()">Đang tải…</p>
      <p *ngIf="!loading() && items().length === 0" class="muted">
        Bạn chưa lưu công thức nào. Hãy <a routerLink="/recipes">khám phá ngay</a>.
      </p>
      <ul class="fav-list" *ngIf="items().length > 0">
        <li *ngFor="let r of items()">
          <a [routerLink]="['/recipes', r.id]">{{ r.title }}</a>
          <button class="btn-secondary" (click)="remove(r.id)">Bỏ lưu</button>
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      .fav-list { list-style: none; padding: 0; }
      .fav-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 14px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius);
        background: var(--color-surface);
        margin-bottom: 8px;
      }
    `
  ]
})
export class FavoritesComponent implements OnInit {
  private readonly favorites = inject(FavoritesService);
  readonly items = signal<RecipeSummary[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.favorites.list().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  remove(id: number): void {
    this.favorites.remove(id).subscribe(() => this.load());
  }
}
