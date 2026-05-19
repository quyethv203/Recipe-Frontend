import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MealPlan, MealPlanService } from './meal-plan.service';

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;

@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container">
      <h2>Lịch nấu ăn</h2>
      <p class="muted">Hiển thị các bữa đã lên kế hoạch trong tuần. (Scaffold — sẽ phát triển kéo-thả sau.)</p>

      <p *ngIf="loading()">Đang tải…</p>
      <div *ngIf="!loading() && plans().length === 0" class="muted">Chưa có bữa nào.</div>

      <div class="grid" *ngIf="plans().length > 0">
        <div *ngFor="let m of meals" class="card">
          <h4>{{ labelFor(m) }}</h4>
          <ul>
            <li *ngFor="let p of byMeal(m)">{{ p.planDate }} — {{ p.recipeTitle }}</li>
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
        margin-top: 16px;
      }
      ul { padding-left: 18px; margin: 6px 0 0; }
    `
  ]
})
export class MealPlannerComponent implements OnInit {
  private readonly service = inject(MealPlanService);
  readonly plans = signal<MealPlan[]>([]);
  readonly loading = signal(false);
  readonly meals = MEAL_TYPES;

  ngOnInit(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: (data) => {
        this.plans.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  byMeal(type: (typeof MEAL_TYPES)[number]): MealPlan[] {
    return this.plans().filter((p) => p.mealType === type);
  }

  labelFor(type: (typeof MEAL_TYPES)[number]): string {
    return { BREAKFAST: 'Sáng', LUNCH: 'Trưa', DINNER: 'Chiều', SNACK: 'Phụ' }[type];
  }
}
