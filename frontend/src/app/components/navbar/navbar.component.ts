import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">María<span class="logo-accent">Clases</span></span>
        </a>

        <button class="menu-toggle" (click)="toggleMenu()" [class.active]="menuOpen()">
          <span></span><span></span><span></span>
        </button>

        <div class="nav-links" [class.open]="menuOpen()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Inicio</a>
          <a routerLink="/reservar" routerLinkActive="active" (click)="closeMenu()">Reservar Clase</a>

          @if (auth.isLoggedIn()) {
            <a routerLink="/mis-clases" routerLinkActive="active" (click)="closeMenu()">Mis Clases</a>
            @if (auth.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="active" (click)="closeMenu()">Panel Admin</a>
            }
            <div class="user-menu">
              <span class="user-name">👋 {{ auth.userName() }}</span>
              <button class="btn-logout" (click)="auth.logout(); closeMenu()">Salir</button>
            </div>
          } @else {
            <a routerLink="/login" routerLinkActive="active" class="btn-login" (click)="closeMenu()">Iniciar Sesión</a>
            <a routerLink="/registro" routerLinkActive="active" class="btn-register" (click)="closeMenu()">Registrarse</a>
          }
        </div>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  menuOpen = signal(false);

  constructor(public auth: AuthService) {}

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
