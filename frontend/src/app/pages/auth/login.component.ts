import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>👋 ¡Bienvenido/a!</h1>
          <p>Inicia sesión para reservar tus clases</p>
        </div>

        @if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        }

        <form (ngSubmit)="login()">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" [(ngModel)]="email" name="email"
                   placeholder="tu&#64;email.com" required />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input id="password" type="password" [(ngModel)]="password" name="password"
                   placeholder="Tu contraseña" required />
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading()">
            {{ loading() ? 'Entrando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <p class="auth-footer">
          ¿No tienes cuenta? <a routerLink="/registro">Regístrate gratis</a>
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
    private router: Router
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
        this.error.set(err.error?.message || 'Error al iniciar sesión');
        this.loading.set(false);
      }
    });
  }
}
