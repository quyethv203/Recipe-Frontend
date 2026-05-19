import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MealType } from '../../core/models/recipe.model';

export interface MealPlan {
  id: number;
  recipeId: number;
  recipeTitle: string;
  planDate: string;
  mealType: MealType;
}

export interface MealPlanCreateRequest {
  recipeId: number;
  planDate: string;
  mealType: MealType;
}

@Injectable({ providedIn: 'root' })
export class MealPlanService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/meal-plans`;

  list(from?: string, to?: string): Observable<MealPlan[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<MealPlan[]>(this.baseUrl, { params });
  }

  add(payload: MealPlanCreateRequest): Observable<MealPlan> {
    return this.http.post<MealPlan>(this.baseUrl, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
