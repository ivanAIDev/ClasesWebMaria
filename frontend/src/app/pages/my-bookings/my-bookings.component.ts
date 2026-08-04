import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { BookingDto, BookingStatus } from '../../models/interfaces';
import { TranslationService } from '../../i18n/translation.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [RouterLink, DatePipe, TranslatePipe],
  template: `
    <div class="bookings-page">
      <div class="bookings-container">
        <div class="page-header">
          <h1>{{ 'myBookings.title' | translate }}</h1>
          <a routerLink="/reservar" class="btn-new">{{ 'myBookings.new' | translate }}</a>
        </div>

        @if (!auth.isLoggedIn()) {
          <div class="auth-needed">
            <p>{{ 'myBookings.needLogin' | translate }}</p>
            <a routerLink="/login" class="btn-primary">{{ 'nav.login' | translate }}</a>
          </div>
        } @else if (loading()) {
          <div class="loading">{{ 'myBookings.loading' | translate }}</div>
        } @else if (bookings().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">📭</span>
            <h3>{{ 'myBookings.empty' | translate }}</h3>
            <p>{{ 'myBookings.emptyDesc' | translate }}</p>
            <a routerLink="/reservar" class="btn-primary">{{ 'myBookings.bookBtn' | translate }}</a>
          </div>
        } @else {
          <div class="bookings-list">
            @for (booking of bookings(); track booking.id) {
              <div class="booking-card" [class]="'status-' + booking.status.toLowerCase()">
                <div class="booking-date-col">
                  <span class="booking-day">{{ booking.date | date:'d' }}</span>
                  <span class="booking-month">{{ booking.date | date:'MMM' }}</span>
                </div>
                <div class="booking-info">
                  <h3>{{ booking.lessonTypeName }}</h3>
                  <p class="booking-time">
                    🕐 {{ formatTime(booking.startTime) }} — {{ formatTime(booking.endTime) }}
                  </p>
                  @if (booking.meetingLink) {
                    <a [href]="booking.meetingLink" target="_blank" class="meeting-link">
                      {{ 'myBookings.join' | translate }}
                    </a>
                  }
                </div>
                <div class="booking-status-col">
                  <span class="status-badge" [class]="'badge-' + booking.status.toLowerCase()">
                    {{ getStatusLabel(booking.status) }}
                  </span>
                  <span class="booking-price">{{ booking.price }}€</span>
                  @if (canCancel(booking)) {
                    <button class="btn-cancel" (click)="cancelBooking(booking)">
                      {{ 'myBookings.cancel' | translate }}
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {
  bookings = signal<BookingDto[]>([]);
  loading = signal(true);

  constructor(
    public auth: AuthService,
    private api: ApiService,
    public ts: TranslationService
  ) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.api.getMyBookings().subscribe({
        next: (b) => { this.bookings.set(b); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  formatTime(timeStr: string): string {
    const parts = timeStr.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

  getStatusLabel(status: BookingStatus): string {
    return this.ts.t('status.' + status);
  }

  canCancel(booking: BookingDto): boolean {
    return booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed;
  }

  cancelBooking(booking: BookingDto) {
    if (confirm(this.ts.t('myBookings.cancelConfirm'))) {
      this.api.cancelBooking(booking.id).subscribe(() => {
        this.bookings.update(list =>
          list.map(b => b.id === booking.id ? { ...b, status: BookingStatus.Cancelled } : b)
        );
      });
    }
  }
}
