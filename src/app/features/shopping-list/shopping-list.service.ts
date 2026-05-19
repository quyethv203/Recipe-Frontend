import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ShoppingItem {
  id: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  isPurchased: boolean;
}

export interface ShoppingItemAddRequest {
  ingredientName: string;
  quantity: number;
  unit: string;
}

export interface ShoppingGenerateRequest {
  fromDate: string;
  toDate: string;
}

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/shopping-lists`;

  list(): Observable<ShoppingItem[]> {
    return this.http.get<ShoppingItem[]>(this.baseUrl);
  }

  add(payload: ShoppingItemAddRequest): Observable<ShoppingItem> {
    return this.http.post<ShoppingItem>(this.baseUrl, payload);
  }

  generate(payload: ShoppingGenerateRequest): Observable<ShoppingItem[]> {
    return this.http.post<ShoppingItem[]>(`${this.baseUrl}/generate`, payload);
  }

  toggle(id: number): Observable<ShoppingItem> {
    return this.http.put<ShoppingItem>(`${this.baseUrl}/${id}/toggle`, {});
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
