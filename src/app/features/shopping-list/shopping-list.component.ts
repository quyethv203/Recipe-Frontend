import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ShoppingItem, ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container">
      <h2>Danh sách đi chợ</h2>
      <p *ngIf="loading()">Đang tải…</p>
      <ul class="list" *ngIf="items().length > 0">
        <li *ngFor="let it of items()" [class.purchased]="it.isPurchased">
          <label>
            <input
              type="checkbox"
              [checked]="it.isPurchased"
              (change)="toggle(it.id)"
            />
            <strong>{{ it.quantity }} {{ it.unit }}</strong> {{ it.ingredientName }}
          </label>
          <button class="btn-secondary" (click)="remove(it.id)">×</button>
        </li>
      </ul>
      <p *ngIf="!loading() && items().length === 0" class="muted">Danh sách trống.</p>
    </section>
  `,
  styles: [
    `
      .list { list-style: none; padding: 0; }
      .list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius);
        background: var(--color-surface);
        margin-bottom: 6px;
      }
      .purchased { opacity: 0.55; text-decoration: line-through; }
      label { display: flex; align-items: center; gap: 10px; flex: 1; cursor: pointer; }
    `
  ]
})
export class ShoppingListComponent implements OnInit {
  private readonly service = inject(ShoppingListService);
  readonly items = signal<ShoppingItem[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggle(id: number): void {
    this.service.toggle(id).subscribe(() => this.load());
  }

  remove(id: number): void {
    this.service.remove(id).subscribe(() => this.load());
  }
}
