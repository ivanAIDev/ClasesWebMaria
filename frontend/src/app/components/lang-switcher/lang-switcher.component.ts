import { Component, signal, HostListener, ElementRef } from '@angular/core';
import { TranslationService } from '../../i18n/translation.service';
import { Lang } from '../../i18n/translations';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  host: { 'class': 'lang-switcher-host' },
  template: `
    <div class="lang-switcher">
      <button class="lang-btn" (click)="toggleDropdown($event)" [attr.aria-expanded]="open()">
        <span class="lang-flag">{{ ts.currentLangOption().flag }}</span>
        <span class="lang-code">{{ ts.currentLangOption().code.toUpperCase() }}</span>
        <span class="lang-arrow" [class.open]="open()">▾</span>
      </button>

      @if (open()) {
        <div class="lang-dropdown" (click)="$event.stopPropagation()">
          @for (lang of ts.languages; track lang.code) {
            <button
              class="lang-option"
              [class.active]="lang.code === ts.currentLang()"
              (click)="selectLang(lang.code)">
              <span class="option-flag">{{ lang.flag }}</span>
              <span class="option-label">{{ lang.label }}</span>
              @if (lang.code === ts.currentLang()) {
                <span class="option-check">✓</span>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
      position: relative;
    }

    .lang-switcher {
      position: relative;
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.7rem;
      border: 1.5px solid rgba(0,0,0,0.12);
      border-radius: 8px;
      background: rgba(255,255,255,0.9);
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      color: #2d3436;
      transition: all 0.2s;
      white-space: nowrap;

      &:hover {
        border-color: #e17055;
        background: white;
      }
    }

    .lang-flag { font-size: 1.1rem; }

    .lang-code { letter-spacing: 0.03em; }

    .lang-arrow {
      font-size: 0.7rem;
      transition: transform 0.2s;
      &.open { transform: rotate(180deg); }
    }

    .lang-dropdown {
      position: fixed;
      background: white;
      border: 1.5px solid rgba(0,0,0,0.1);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      overflow: hidden;
      z-index: 9999;
      min-width: 170px;
      animation: dropIn 0.15s ease-out;
    }

    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .lang-option {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      width: 100%;
      padding: 0.65rem 1rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 0.9rem;
      color: #2d3436;
      transition: background 0.15s;
      text-align: left;

      &:hover { background: #ffecd2; }
      &.active {
        background: #fff3e6;
        font-weight: 600;
      }
    }

    .option-flag { font-size: 1.15rem; }
    .option-check {
      margin-left: auto;
      color: #e17055;
      font-weight: 700;
    }
  `]
})
export class LangSwitcherComponent {
  open = signal(false);

  constructor(public ts: TranslationService, private elRef: ElementRef) {}

  toggleDropdown(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.open()) {
      this.open.set(false);
    } else {
      this.open.set(true);
      // Position the dropdown using fixed positioning to avoid overflow clipping
      setTimeout(() => {
        const btn = this.elRef.nativeElement.querySelector('.lang-btn') as HTMLElement;
        const dropdown = this.elRef.nativeElement.querySelector('.lang-dropdown') as HTMLElement;
        if (btn && dropdown) {
          const rect = btn.getBoundingClientRect();
          dropdown.style.top = (rect.bottom + 6) + 'px';
          dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        }
      });
    }
  }

  selectLang(code: Lang) {
    this.ts.setLang(code);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: Event) {
    if (this.open() && !this.elRef.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
