import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AuthResponse, LoginRequest, RegisterRequest, UserDto,
  TeacherProfileDto, LessonTypeDto, TimeSlotDto,
  CreateBookingRequest, BookingDto, ReviewDto,
  CreateReviewRequest, DashboardStatsDto
} from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Auth
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, request);
  }

  getMe(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.baseUrl}/auth/me`);
  }

  // Teacher Profile
  getTeacherProfile(): Observable<TeacherProfileDto> {
    return this.http.get<TeacherProfileDto>(`${this.baseUrl}/teacher/profile`);
  }

  getLessonTypes(): Observable<LessonTypeDto[]> {
    return this.http.get<LessonTypeDto[]>(`${this.baseUrl}/teacher/lessons`);
  }

  // Availability
  getAvailableSlots(startDate: string, endDate: string, durationMinutes: number = 60): Observable<TimeSlotDto[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('durationMinutes', durationMinutes.toString());
    return this.http.get<TimeSlotDto[]>(`${this.baseUrl}/availability/slots`, { params });
  }

  // Bookings
  createBooking(request: CreateBookingRequest): Observable<BookingDto> {
    return this.http.post<BookingDto>(`${this.baseUrl}/bookings`, request);
  }

  getMyBookings(): Observable<BookingDto[]> {
    return this.http.get<BookingDto[]>(`${this.baseUrl}/bookings/my`);
  }

  cancelBooking(id: string, reason?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookings/${id}/cancel`, JSON.stringify(reason), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Reviews
  getReviews(): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.baseUrl}/reviews`);
  }

  createReview(request: CreateReviewRequest): Observable<ReviewDto> {
    return this.http.post<ReviewDto>(`${this.baseUrl}/reviews`, request);
  }

  // Admin
  getDashboard(): Observable<DashboardStatsDto> {
    return this.http.get<DashboardStatsDto>(`${this.baseUrl}/bookings/dashboard`);
  }

  getAllBookings(from?: string, to?: string, status?: string): Observable<BookingDto[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    if (status) params = params.set('status', status);
    return this.http.get<BookingDto[]>(`${this.baseUrl}/bookings`, { params });
  }

  updateBookingStatus(id: string, request: any): Observable<BookingDto> {
    return this.http.put<BookingDto>(`${this.baseUrl}/bookings/${id}/status`, request);
  }
}
