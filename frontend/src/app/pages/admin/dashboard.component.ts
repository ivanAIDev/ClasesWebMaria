import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { DashboardStatsDto, BookingDto, BookingStatus } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  template: `
    <div class="dashboard-page">
      @if (!auth.isAdmin()) {
        <div class="access-denied">
          <h2>🔒 Acceso restringido</h2>
          <p>Esta sección es solo para administradores</p>
          <a routerLink="/" class="btn-primary">Volver al Inicio</a>
        </div>
      } @else {
        <div class="dashboard-container">
          <h1>📊 Panel de Administración</h1>

          @if (stats(); as s) {
            <!-- Stats Cards -->
            <div class="stats-grid">
              <div class="stat-card orange">
                <span class="stat-icon">📅</span>
                <div class="stat-info">
                  <span class="stat-value">{{ s.totalBookingsThisMonth }}</span>
                  <span class="stat-label">Reservas este mes</span>
                </div>
              </div>
              <div class="stat-card yellow">
                <span class="stat-icon">⏳</span>
                <div class="stat-info">
                  <span class="stat-value">{{ s.pendingBookings }}</span>
                  <span class="stat-label">Pendientes</span>
                </div>
              </div>
              <div class="stat-card green">
                <span class="stat-icon">💰</span>
                <div class="stat-info">
                  <span class="stat-value">{{ s.revenueThisMonth | number:'1.0-0' }}€</span>
                  <span class="stat-label">Ingresos mes</span>
                </div>
              </div>
              <div class="stat-card blue">
                <span class="stat-icon">👥</span>
                <div class="stat-info">
                  <span class="stat-value">{{ s.totalStudents }}</span>
                  <span class="stat-label">Alumnos</span>
                </div>
              </div>
            </div>

            <!-- Upcoming Bookings -->
            <div class="section-card">
              <h2>📋 Próximas Clases</h2>
              @if (s.upcomingBookings.length === 0) {
                <p class="no-data">No hay clases próximas</p>
              } @else {
                <div class="bookings-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Alumno</th>
                        <th>Clase</th>
                        <th>Estado</th>
                        <th>Acciones</th>
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
            <div class="loading">Cargando panel...</div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStatsDto | null>(null);

  constructor(public auth: AuthService, private api: ApiService) {}

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
    const map: Record<string, string> = {
      Pending: 'Pendiente', Confirmed: 'Confirmada',
      Cancelled: 'Cancelada', Completed: 'Completada'
    };
    return map[status] || status;
  }

  confirmBooking(b: BookingDto) {
    this.api.updateBookingStatus(b.id, { status: 'Confirmed' }).subscribe(() => {
      this.api.getDashboard().subscribe(s => this.stats.set(s));
    });
  }

  cancelBookingAdmin(b: BookingDto) {
    this.api.updateBookingStatus(b.id, {
      status: 'Cancelled',
      cancellationReason: 'Cancelada por la profesora'
    }).subscribe(() => {
      this.api.getDashboard().subscribe(s => this.stats.set(s));
    });
  }
}
