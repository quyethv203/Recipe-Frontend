import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '../../core/models/auth.model';
import { TokenStorageService } from '../../core/services/token-storage.service';

interface AuthApiEnvelope {
  data: AuthResponse;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthApiEnvelope>(`${this.baseUrl}/login`, payload)
      .pipe(
        map((res) => res.data),
        tap((auth) => this.persist(auth))
      );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthApiEnvelope>(`${this.baseUrl}/register`, payload)
      .pipe(
        map((res) => res.data),
        tap((auth) => this.persist(auth))
      );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  private persist(auth: AuthResponse): void {
    this.tokenStorage.saveTokens(auth.accessToken, auth.refreshToken);
    this.tokenStorage.saveUser(auth.user);
  }
}
