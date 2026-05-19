import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipes/recipe.service';
import { RecipeDetail } from '../../core/models/recipe.model';

@Component({
  selector: 'app-cooking-mode',
  standalone: true,
  imports: [NgIf, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cook-wrap" *ngIf="recipe() as r; else loadingTpl">
      <header>
        <h2>{{ r.title }}</h2>
        <div class="step-indicator">Bước {{ currentIndex() + 1 }} / {{ r.steps.length }}</div>
      </header>

      <div class="step-box card" *ngIf="r.steps[currentIndex()] as step">
        <p class="instruction">{{ step.instruction }}</p>
        <div class="timer" *ngIf="step.timerSeconds">⏱ {{ formatTime(remaining()) }}</div>
        <div class="actions">
          <button class="btn-secondary" *ngIf="step.timerSeconds && !running()" (click)="startTimer(step.timerSeconds)">
            Bắt đầu Timer
          </button>
          <button class="btn-secondary" *ngIf="running()" (click)="stopTimer()">Dừng</button>
        </div>
      </div>

      <nav class="nav">
        <button class="btn-secondary" (click)="prev()" [disabled]="currentIndex() === 0">← Trước</button>
        <button (click)="next()" [disabled]="currentIndex() === r.steps.length - 1">Tiếp →</button>
      </nav>
    </section>

    <ng-template #loadingTpl>
      <p class="container">Đang tải công thức…</p>
    </ng-template>
  `,
  styleUrl: './cooking-mode.component.scss'
})
export class CookingModeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);

  readonly recipe = signal<RecipeDetail | null>(null);
  readonly currentIndex = signal(0);
  readonly remaining = signal(0);
  readonly running = signal(false);

  private timerId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('recipeId'));
    if (!id) return;
    this.recipeService.getById(id).subscribe((r) => this.recipe.set(r));
  }

  next(): void {
    this.stopTimer();
    this.currentIndex.update((i) => i + 1);
  }

  prev(): void {
    this.stopTimer();
    this.currentIndex.update((i) => Math.max(0, i - 1));
  }

  startTimer(seconds: number): void {
    this.remaining.set(seconds);
    this.running.set(true);
    this.timerId = setInterval(() => {
      const left = this.remaining() - 1;
      this.remaining.set(left);
      if (left <= 0) this.stopTimer();
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
    this.running.set(false);
  }

  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
}
