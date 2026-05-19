import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RecipeCreateRequest,
  RecipeDetail,
  RecipeSummary
} from '../../core/models/recipe.model';

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface RecipeSearchParams {
  q?: string;
  categoryId?: number;
  difficulty?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/recipes`;

  list(page = 0, size = 12): Observable<PagedResponse<RecipeSummary>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<RecipeSummary>>(this.baseUrl, { params });
  }

  search(criteria: RecipeSearchParams): Observable<PagedResponse<RecipeSummary>> {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(criteria)) {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    }
    return this.http.get<PagedResponse<RecipeSummary>>(`${this.baseUrl}/search`, { params });
  }

  getById(id: number): Observable<RecipeDetail> {
    return this.http.get<RecipeDetail>(`${this.baseUrl}/${id}`);
  }

  create(payload: RecipeCreateRequest): Observable<RecipeDetail> {
    return this.http.post<RecipeDetail>(this.baseUrl, payload);
  }

  update(id: number, payload: RecipeCreateRequest): Observable<RecipeDetail> {
    return this.http.put<RecipeDetail>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
