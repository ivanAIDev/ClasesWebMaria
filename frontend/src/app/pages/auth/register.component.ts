import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🎓 Crea tu cuenta</h1>
          <p>Regístrate para empezar a aprender</p>
        </div>

        @if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        }

        <form (ngSubmit)="register()">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Nombre</label>
              <input id="firstName" type="text" [(ngModel)]="firstName" name="firstName"
                     placeholder="Tu nombre" required />
            </div>
            <div class="form-group">
              <label for="lastName">Apellidos</label>
              <input id="lastName" type="text" [(ngModel)]="lastName" name="lastName"
                     placeholder="Tus apellidos" required />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" [(ngModel)]="email" name="email"
                   placeholder="tu&#64;email.com" required />
          </div>

          <div class="form-group">
            <label for="phone">Teléfono (opcional)</label>
            <input id="phone" type="tel" [(ngModel)]="phone" name="phone"
                   placeholder="+34 600 000 000" />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input id="password" type="password" [(ngModel)]="password" name="password"
                   placeholder="Mínimo 6 caracteres" required />
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading()">
            {{ loading() ? 'Creando cuenta...' : 'Registrarse' }}
          </button>
        </form>

        <p class="auth-footer">
          ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a>
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
    private router: Router
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
        this.error.set(err.error?.message || 'Error al registrarse');
        this.loading.set(false);
      }
    });
  }
}
