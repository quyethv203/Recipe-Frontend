import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { RecipeSummary } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container">
      <div class="list-header">
        <h2>Công thức</h2>
        <a routerLink="/recipes/new"><button>+ Thêm công thức</button></a>
      </div>

      <div class="search-row">
        <input
          type="text"
          placeholder="Tìm theo tên món…"
          [(ngModel)]="query"
          (keyup.enter)="search()"
        />
        <button class="btn-secondary" (click)="search()">Tìm</button>
      </div>

      <p *ngIf="loading()" class="muted">Đang tải…</p>
      <p *ngIf="errorMessage()" class="error-text">{{ errorMessage() }}</p>

      <div class="grid" *ngIf="!loading() && recipes().length > 0">
        <a *ngFor="let r of recipes()" [routerLink]="['/recipes', r.id]" class="card recipe-card">
          <div class="thumb" [style.backgroundImage]="thumb(r)"></div>
          <h3>{{ r.title }}</h3>
          <p class="muted">{{ r.description }}</p>
          <div class="meta">
            <span *ngIf="r.prepTime">⏱ {{ r.prepTime }}'</span>
            <span *ngIf="r.difficulty">• {{ r.difficulty }}</span>
            <span *ngIf="r.averageRating">• ★ {{ r.averageRating | number: '1.1-1' }}</span>
          </div>
        </a>
      </div>

      <p *ngIf="!loading() && recipes().length === 0" class="muted">Chưa có công thức nào.</p>
    </section>
  `,
  styleUrl: './recipe-list.component.scss'
})
export class RecipeListComponent implements OnInit {
  private readonly recipeService = inject(RecipeService);

  readonly recipes = signal<RecipeSummary[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  query = '';

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.recipeService.list().subscribe({
      next: (res) => {
        this.recipes.set(res.content);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Không tải được danh sách công thức.');
        this.loading.set(false);
      }
    });
  }

  search(): void {
    if (!this.query.trim()) {
      this.load();
      return;
    }
    this.loading.set(true);
    this.recipeService.search({ q: this.query.trim() }).subscribe({
      next: (res) => {
        this.recipes.set(res.content);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Tìm kiếm thất bại.');
        this.loading.set(false);
      }
    });
  }

  thumb(r: RecipeSummary): string {
    return r.thumbnailUrl ? `url(${r.thumbnailUrl})` : 'linear-gradient(135deg, #ffd9b3, #ffb27a)';
  }
}
