import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CommentDto {
  id: number;
  userId: number;
  username: string;
  parentId?: number | null;
  rating?: number;
  content: string;
  createdAt: string;
  replies?: CommentDto[];
}

export interface CommentCreateRequest {
  content: string;
  rating?: number;
  parentId?: number;
}

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}`;

  listFor(recipeId: number): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(`${this.baseUrl}/recipes/${recipeId}/comments`);
  }

  add(recipeId: number, payload: CommentCreateRequest): Observable<CommentDto> {
    return this.http.post<CommentDto>(`${this.baseUrl}/recipes/${recipeId}/comments`, payload);
  }

  remove(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${commentId}`);
  }
}
