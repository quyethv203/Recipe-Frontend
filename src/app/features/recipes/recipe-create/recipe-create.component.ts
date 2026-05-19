import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipeService } from '../recipe.service';
import { RecipeCreateRequest } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container">
      <h2>Tạo công thức mới</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" class="card create-form">
        <div class="form-field">
          <label>Tên món</label>
          <input formControlName="title" />
        </div>

        <div class="form-field">
          <label>Mô tả ngắn</label>
          <textarea rows="3" formControlName="description"></textarea>
        </div>

        <div class="row">
          <div class="form-field">
            <label>Chuẩn bị (phút)</label>
            <input type="number" formControlName="prepTime" />
          </div>
          <div class="form-field">
            <label>Nấu (phút)</label>
            <input type="number" formControlName="cookTime" />
          </div>
          <div class="form-field">
            <label>Số phần</label>
            <input type="number" formControlName="servings" />
          </div>
          <div class="form-field">
            <label>Độ khó</label>
            <select formControlName="difficulty">
              <option value="EASY">Dễ</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="HARD">Khó</option>
            </select>
          </div>
        </div>

        <h3>Nguyên liệu</h3>
        <div formArrayName="ingredients">
          <div *ngFor="let ig of ingredients.controls; let i = index" [formGroupName]="i" class="repeat-row">
            <input placeholder="Tên" formControlName="name" />
            <input placeholder="SL" type="number" formControlName="quantity" />
            <input placeholder="Đơn vị" formControlName="unit" />
            <button type="button" class="btn-secondary" (click)="removeIngredient(i)">×</button>
          </div>
        </div>
        <button type="button" class="btn-secondary" (click)="addIngredient()">+ Thêm nguyên liệu</button>

        <h3>Các bước</h3>
        <div formArrayName="steps">
          <div *ngFor="let st of steps.controls; let i = index" [formGroupName]="i" class="step-row">
            <span class="step-no">{{ i + 1 }}</span>
            <textarea rows="2" placeholder="Mô tả bước" formControlName="instruction"></textarea>
            <input placeholder="Timer (giây)" type="number" formControlName="timerSeconds" />
            <button type="button" class="btn-secondary" (click)="removeStep(i)">×</button>
          </div>
        </div>
        <button type="button" class="btn-secondary" (click)="addStep()">+ Thêm bước</button>

        <p class="error-text" *ngIf="errorMessage()">{{ errorMessage() }}</p>
        <div class="actions">
          <button type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Đang lưu…' : 'Lưu công thức' }}
          </button>
        </div>
      </form>
    </section>
  `,
  styleUrl: './recipe-create.component.scss'
})
export class RecipeCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    prepTime: [10],
    cookTime: [20],
    servings: [2],
    difficulty: ['EASY' as 'EASY' | 'MEDIUM' | 'HARD'],
    ingredients: this.fb.array([this.newIngredient()]),
    steps: this.fb.array([this.newStep(1)])
  });

  get ingredients(): FormArray<FormGroup> {
    return this.form.get('ingredients') as FormArray<FormGroup>;
  }

  get steps(): FormArray<FormGroup> {
    return this.form.get('steps') as FormArray<FormGroup>;
  }

  addIngredient(): void {
    this.ingredients.push(this.newIngredient());
  }

  removeIngredient(i: number): void {
    if (this.ingredients.length > 1) this.ingredients.removeAt(i);
  }

  addStep(): void {
    this.steps.push(this.newStep(this.steps.length + 1));
  }

  removeStep(i: number): void {
    if (this.steps.length > 1) {
      this.steps.removeAt(i);
      this.steps.controls.forEach((c, idx) => c.patchValue({ stepNumber: idx + 1 }));
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set(null);
    const payload = this.form.getRawValue() as RecipeCreateRequest;
    this.recipeService.create(payload).subscribe({
      next: (r) => {
        this.loading.set(false);
        this.router.navigate(['/recipes', r.id]);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Tạo công thức thất bại.');
      }
    });
  }

  private newIngredient(): FormGroup {
    return this.fb.nonNullable.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0)]],
      unit: ['g', Validators.required],
      notes: ['']
    });
  }

  private newStep(stepNumber: number): FormGroup {
    return this.fb.nonNullable.group({
      stepNumber: [stepNumber],
      instruction: ['', Validators.required],
      timerSeconds: [0]
    });
  }
}
