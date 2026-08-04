import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse, UserRole } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'wc_token';
  private readonly USER_KEY = 'wc_user';

  private authState = signal<AuthResponse | null>(this.loadFromStorage());

  readonly isLoggedIn = computed(() => {
    const state = this.authState();
    if (!state) return false;
    return new Date(state.expiresAt) > new Date();
  });

  readonly currentUser = computed(() => this.authState());
  readonly isAdmin = computed(() => this.authState()?.role === UserRole.Admin);
  readonly userName = computed(() => this.authState()?.fullName ?? '');

  constructor(private router: Router) {}

  setAuth(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response));
    this.authState.set(response);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authState.set(null);
    this.router.navigate(['/']);
  }

  private loadFromStorage(): AuthResponse | null {
    const stored = localStorage.getItem(this.USER_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as AuthResponse;
      if (new Date(parsed.expiresAt) <= new Date()) {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }
}
