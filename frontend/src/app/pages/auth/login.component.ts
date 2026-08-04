import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../i18n/translation.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>{{ 'auth.loginTitle' | translate }}</h1>
          <p>{{ 'auth.loginSubtitle' | translate }}</p>
        </div>

        @if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        }

        <form (ngSubmit)="login()">
          <div class="form-group">
            <label for="email">{{ 'auth.email' | translate }}</label>
            <input id="email" type="email" [(ngModel)]="email" name="email"
                   placeholder="tu&#64;email.com" required />
          </div>

          <div class="form-group">
            <label for="password">{{ 'auth.password' | translate }}</label>
            <input id="password" type="password" [(ngModel)]="password" name="password"
                   placeholder="••••••" required />
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading()">
            {{ loading() ? ts.t('auth.loggingIn') : ts.t('auth.loginBtn') }}
          </button>
        </form>

        <p class="auth-footer">
          {{ 'auth.noAccount' | translate }} <a routerLink="/registro">{{ 'auth.registerLink' | translate }}</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './auth.styles.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    public ts: TranslationService
  ) {}

  login() {
    this.loading.set(true);
    this.error.set('');

    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.auth.setAuth(response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error');
        this.loading.set(false);
      }
    });
  }
}
