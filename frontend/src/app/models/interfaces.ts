export enum UserRole {
  Student = 'Student',
  Teacher = 'Teacher',
  Admin = 'Admin'
}

export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
  NoShow = 'NoShow'
}

export enum Language {
  Spanish = 'Spanish',
  English = 'English'
}

export enum LessonModality {
  Online = 'Online',
  InPerson = 'InPerson',
  Both = 'Both'
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: UserRole;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface TeacherProfileDto {
  id: string;
  title: string;
  bio: string;
  profileImageUrl?: string;
  videoIntroUrl?: string;
  pricePerHourSpanish: number;
  pricePerHourEnglish: number;
  czkEurRate: number;
  modality: LessonModality;
  location?: string;
  yearsOfExperience: number;
  qualifications?: string;
  specialtyDescription?: string;
  lessonTypes: LessonTypeDto[];
  averageRating: number;
  totalReviews: number;
}

export interface LessonTypeDto {
  id: string;
  name: string;
  description: string;
  language: Language;
  durationMinutes: number;
  price: number;
  priceCzk: number;
  modality: LessonModality;
  icon?: string;
  sortOrder: number;
}

export interface TimeSlotDto {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface CreateBookingRequest {
  lessonTypeId: string;
  date: string;
  startTime: string;
  studentNotes?: string;
}

export interface BookingDto {
  id: string;
  studentId: string;
  studentName: string;
  lessonTypeId: string;
  lessonTypeName: string;
  language: Language;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  studentNotes?: string;
  teacherNotes?: string;
  price: number;
  meetingLink?: string;
  createdAt: string;
}

export interface ReviewDto {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}

export interface DashboardStatsDto {
  totalBookingsThisMonth: number;
  pendingBookings: number;
  completedBookings: number;
  revenueThisMonth: number;
  totalStudents: number;
  averageRating: number;
  upcomingBookings: BookingDto[];
}
