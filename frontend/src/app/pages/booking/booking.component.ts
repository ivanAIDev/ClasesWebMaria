import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LessonTypeDto, TimeSlotDto } from '../../models/interfaces';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  // Step management
  currentStep = signal(1);

  // Step 1: Lesson selection
  lessonTypes = signal<LessonTypeDto[]>([]);
  selectedLesson = signal<LessonTypeDto | null>(null);

  // Step 2: Date & time
  today = new Date();
  currentWeekStart = signal(this.getNextMonday());
  weekDays = computed(() => this.getWeekDays(this.currentWeekStart()));
  slots = signal<TimeSlotDto[]>([]);
  selectedSlot = signal<TimeSlotDto | null>(null);
  loadingSlots = signal(false);

  // Step 3: Confirm
  studentNotes = '';
  booking = signal(false);
  bookingSuccess = signal(false);
  error = signal('');

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.api.getLessonTypes().subscribe(types => this.lessonTypes.set(types));
  }

  // Step 1
  selectLesson(lesson: LessonTypeDto) {
    this.selectedLesson.set(lesson);
    this.currentStep.set(2);
    this.loadSlots();
  }

  // Step 2
  loadSlots() {
    const lesson = this.selectedLesson();
    if (!lesson) return;

    this.loadingSlots.set(true);
    const start = this.currentWeekStart();
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    this.api.getAvailableSlots(
      this.formatDate(start),
      this.formatDate(end),
      lesson.durationMinutes
    ).subscribe({
      next: (slots) => {
        this.slots.set(slots);
        this.loadingSlots.set(false);
      },
      error: () => this.loadingSlots.set(false)
    });
  }

  prevWeek() {
    const d = new Date(this.currentWeekStart());
    d.setDate(d.getDate() - 7);
    if (d >= this.getNextMonday()) {
      this.currentWeekStart.set(d);
      this.loadSlots();
    }
  }

  nextWeek() {
    const d = new Date(this.currentWeekStart());
    d.setDate(d.getDate() + 7);
    this.currentWeekStart.set(d);
    this.loadSlots();
  }

  canGoPrev(): boolean {
    const d = new Date(this.currentWeekStart());
    d.setDate(d.getDate() - 7);
    return d >= this.getStartOfWeek(new Date());
  }

  getSlotsForDay(date: Date): TimeSlotDto[] {
    const dateStr = this.formatDate(date);
    return this.slots().filter(s => s.date === dateStr);
  }

  selectSlot(slot: TimeSlotDto) {
    if (!slot.isAvailable) return;
    this.selectedSlot.set(slot);
    this.currentStep.set(3);
  }

  formatTime(timeStr: string): string {
    const parts = timeStr.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

  // Step 3
  confirmBooking() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const lesson = this.selectedLesson();
    const slot = this.selectedSlot();
    if (!lesson || !slot) return;

    this.booking.set(true);
    this.error.set('');

    this.api.createBooking({
      lessonTypeId: lesson.id,
      date: slot.date,
      startTime: slot.startTime,
      studentNotes: this.studentNotes || undefined
    }).subscribe({
      next: () => {
        this.bookingSuccess.set(true);
        this.booking.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al crear la reserva');
        this.booking.set(false);
      }
    });
  }

  goToStep(step: number) {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
      if (step === 1) {
        this.selectedLesson.set(null);
        this.selectedSlot.set(null);
      }
      if (step === 2) {
        this.selectedSlot.set(null);
      }
    }
  }

  getDayName(date: Date): string {
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  }

  getDayNumber(date: Date): number {
    return date.getDate();
  }

  getMonthName(date: Date): string {
    return date.toLocaleDateString('es-ES', { month: 'long' });
  }

  private getWeekDays(start: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }

  private getNextMonday(): Date {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? 1 : (day === 1 ? 0 : 8 - day);
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
