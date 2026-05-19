import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RecipeSummary } from '../../core/models/recipe.model';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/favorites`;

  list(): Observable<RecipeSummary[]> {
    return this.http.get<RecipeSummary[]>(this.baseUrl);
  }

  add(recipeId: number): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/${recipeId}`, {});
  }

  remove(recipeId: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/${recipeId}`);
  }
}
