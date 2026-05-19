import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { RecipeDetail } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container recipe-detail" *ngIf="recipe() as r; else loadingTpl">
      <header class="head">
        <img *ngIf="r.thumbnailUrl" [src]="r.thumbnailUrl" alt="" class="hero-img" />
        <div>
          <h1>{{ r.title }}</h1>
          <p class="muted">{{ r.description }}</p>
          <div class="meta">
            <span *ngIf="r.prepTime">Chuẩn bị: {{ r.prepTime }}'</span>
            <span *ngIf="r.cookTime">• Nấu: {{ r.cookTime }}'</span>
            <span *ngIf="r.servings">• {{ r.servings }} phần</span>
            <span *ngIf="r.difficulty">• {{ r.difficulty }}</span>
          </div>
          <a [routerLink]="['/cooking', r.id]"><button>▶ Vào Cooking Mode</button></a>
        </div>
      </header>

      <div class="two-col">
        <section class="card">
          <h3>Nguyên liệu</h3>
          <ul class="ingredients">
            <li *ngFor="let ing of r.ingredients">
              <strong>{{ ing.quantity }} {{ ing.unit }}</strong> {{ ing.name }}
              <span class="muted" *ngIf="ing.notes"> — {{ ing.notes }}</span>
            </li>
          </ul>
        </section>

        <section class="card">
          <h3>Các bước thực hiện</h3>
          <ol class="steps">
            <li *ngFor="let s of r.steps">
              <p>{{ s.instruction }}</p>
              <span class="muted" *ngIf="s.timerSeconds">⏱ {{ s.timerSeconds }}s</span>
            </li>
          </ol>
        </section>
      </div>
    </section>

    <ng-template #loadingTpl>
      <p class="container">{{ errorMessage() ?? 'Đang tải…' }}</p>
    </ng-template>
  `,
  styleUrl: './recipe-detail.component.scss'
})
export class RecipeDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);

  readonly recipe = signal<RecipeDetail | null>(null);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage.set('Công thức không hợp lệ.');
      return;
    }
    this.recipeService.getById(id).subscribe({
      next: (r) => this.recipe.set(r),
      error: () => this.errorMessage.set('Không tìm thấy công thức.')
    });
  }
}
