import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../i18n/translation.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { LangSwitcherComponent } from '../lang-switcher/lang-switcher.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LangSwitcherComponent],
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
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">{{ 'nav.home' | translate }}</a>
          <a routerLink="/reservar" routerLinkActive="active" (click)="closeMenu()">{{ 'nav.book' | translate }}</a>

          @if (auth.isLoggedIn()) {
            <a routerLink="/mis-clases" routerLinkActive="active" (click)="closeMenu()">{{ 'nav.myClasses' | translate }}</a>
            @if (auth.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="active" (click)="closeMenu()">{{ 'nav.admin' | translate }}</a>
            }
            <div class="user-menu">
              <span class="user-name">👋 {{ auth.userName() }}</span>
              <button class="btn-logout" (click)="auth.logout(); closeMenu()">{{ 'nav.logout' | translate }}</button>
            </div>
          } @else {
            <a routerLink="/login" routerLinkActive="active" class="btn-login" (click)="closeMenu()">{{ 'nav.login' | translate }}</a>
            <a routerLink="/registro" routerLinkActive="active" class="btn-register" (click)="closeMenu()">{{ 'nav.register' | translate }}</a>
          }

          <app-lang-switcher />
        </div>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  menuOpen = signal(false);

  constructor(public auth: AuthService, public ts: TranslationService) {}

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
