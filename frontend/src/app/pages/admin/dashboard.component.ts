import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { DashboardStatsDto, BookingDto, BookingStatus } from '../../models/interfaces';
import { TranslationService } from '../../i18n/translation.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, TranslatePipe],
  template: `
    <div class="dashboard-page">
      @if (!auth.isAdmin()) {
        <div class="access-denied">
          <h2>{{ 'admin.denied' | translate }}</h2>
          <p>{{ 'admin.deniedMsg' | translate }}</p>
          <a routerLink="/" class="btn-primary">{{ 'admin.backHome' | translate }}</a>
        </div>
      } @else {
        <div class="dashboard-container">
          <h1>{{ 'admin.title' | translate }}</h1>

          @if (stats(); as s) {
            <!-- Stats Cards -->
            <div class="stats-grid">
              <div class="stat-card orange">
                <span class="stat-icon">📅</span>
                <div class="stat-info">
                  <span class="stat-value">{{ s.totalBookingsThisMonth }}</span>
                  <span class="stat-label">{{ 'admin.bookingsMonth' | translate }}</span>
                </div>
              </div>
              <div class="stat-card yellow">
                <span class="stat-icon">⏳</span>
                <div class="stat-info">
                  <span class="stat-value">{{ s.pendingBookings }}</span>
                  <span class="stat-label">{{ 'admin.pending' | translate }}</span>
                </div>
              </div>
              <div class="stat-card green">
                <span class="stat-icon">💰</span>
                <div class="stat-info">
                  <span class="stat-value">{{ s.revenueThisMonth | number:'1.0-0' }}€</span>
                  <span class="stat-label">{{ 'admin.revenue' | translate }}</span>
                </div>
              </div>
              <div class="stat-card blue">
                <span class="stat-icon">👥</span>
                <div class="stat-info">
                  <span class="stat-value">{{ s.totalStudents }}</span>
                  <span class="stat-label">{{ 'admin.students' | translate }}</span>
                </div>
              </div>
            </div>

            <!-- Upcoming Bookings -->
            <div class="section-card">
              <h2>{{ 'admin.upcoming' | translate }}</h2>
              @if (s.upcomingBookings.length === 0) {
                <p class="no-data">{{ 'admin.noUpcoming' | translate }}</p>
              } @else {
                <div class="bookings-table">
                  <table>
                    <thead>
                      <tr>
                        <th>{{ 'admin.date' | translate }}</th>
                        <th>{{ 'admin.time' | translate }}</th>
                        <th>{{ 'admin.student' | translate }}</th>
                        <th>{{ 'admin.class' | translate }}</th>
                        <th>{{ 'admin.status' | translate }}</th>
                        <th>{{ 'admin.actions' | translate }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (b of s.upcomingBookings; track b.id) {
                        <tr>
                          <td>{{ b.date | date:'d MMM' }}</td>
                          <td>{{ formatTime(b.startTime) }}</td>
                          <td><strong>{{ b.studentName }}</strong></td>
                          <td>{{ b.lessonTypeName }}</td>
                          <td>
                            <span class="status-badge" [class]="'badge-' + b.status.toLowerCase()">
                              {{ getStatusLabel(b.status) }}
                            </span>
                          </td>
                          <td class="actions">
                            @if (b.status === 'Pending') {
                              <button class="btn-sm confirm" (click)="confirmBooking(b)">✅</button>
                              <button class="btn-sm cancel" (click)="cancelBookingAdmin(b)">❌</button>
                            }
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          } @else {
            <div class="loading">{{ 'admin.loading' | translate }}</div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStatsDto | null>(null);

  constructor(
    public auth: AuthService,
    private api: ApiService,
    public ts: TranslationService
  ) {}

  ngOnInit() {
    if (this.auth.isAdmin()) {
      this.api.getDashboard().subscribe(s => this.stats.set(s));
    }
  }

  formatTime(t: string): string {
    const p = t.split(':');
    return `${p[0]}:${p[1]}`;
  }

  getStatusLabel(status: string): string {
    return this.ts.t('admin.status' + status);
  }

  confirmBooking(b: BookingDto) {
    this.api.updateBookingStatus(b.id, { status: 'Confirmed' }).subscribe(() => {
      this.api.getDashboard().subscribe(s => this.stats.set(s));
    });
  }

  cancelBookingAdmin(b: BookingDto) {
    this.api.updateBookingStatus(b.id, {
      status: 'Cancelled',
      cancellationReason: 'Cancelled by teacher'
    }).subscribe(() => {
      this.api.getDashboard().subscribe(s => this.stats.set(s));
    });
  }
}
