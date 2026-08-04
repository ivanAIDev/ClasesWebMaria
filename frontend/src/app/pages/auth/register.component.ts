import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../i18n/translation.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>{{ 'auth.registerTitle' | translate }}</h1>
          <p>{{ 'auth.registerSubtitle' | translate }}</p>
        </div>

        @if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        }

        <form (ngSubmit)="register()">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">{{ 'auth.firstName' | translate }}</label>
              <input id="firstName" type="text" [(ngModel)]="firstName" name="firstName"
                     required />
            </div>
            <div class="form-group">
              <label for="lastName">{{ 'auth.lastName' | translate }}</label>
              <input id="lastName" type="text" [(ngModel)]="lastName" name="lastName"
                     required />
            </div>
          </div>

          <div class="form-group">
            <label for="email">{{ 'auth.email' | translate }}</label>
            <input id="email" type="email" [(ngModel)]="email" name="email"
                   placeholder="tu&#64;email.com" required />
          </div>

          <div class="form-group">
            <label for="phone">{{ 'auth.phone' | translate }}</label>
            <input id="phone" type="tel" [(ngModel)]="phone" name="phone"
                   placeholder="+420 600 000 000" />
          </div>

          <div class="form-group">
            <label for="password">{{ 'auth.password' | translate }}</label>
            <input id="password" type="password" [(ngModel)]="password" name="password"
                   [placeholder]="ts.t('auth.passwordHint')" required />
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading()">
            {{ loading() ? ts.t('auth.registering') : ts.t('auth.registerBtn') }}
          </button>
        </form>

        <p class="auth-footer">
          {{ 'auth.hasAccount' | translate }} <a routerLink="/login">{{ 'auth.loginLink' | translate }}</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './auth.styles.scss'
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    public ts: TranslationService
  ) {}

  register() {
    this.loading.set(true);
    this.error.set('');

    this.api.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phone: this.phone || undefined
    }).subscribe({
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
