import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TeacherProfileDto, ReviewDto } from '../../models/interfaces';
import { TranslationService } from '../../i18n/translation.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DecimalPipe, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  profile = signal<TeacherProfileDto | null>(null);
  reviews = signal<ReviewDto[]>([]);

  constructor(private api: ApiService, public ts: TranslationService) {}

  ngOnInit() {
    this.api.getTeacherProfile().subscribe(p => this.profile.set(p));
    this.api.getReviews().subscribe(r => this.reviews.set(r));
  }

  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? '★' : '☆');
  }

  getTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    const lang = this.ts.currentLang();

    if (lang === 'ko') {
      if (days < 1) return '오늘';
      if (days < 7) return `${days}일 전`;
      if (days < 30) return `${Math.floor(days / 7)}주 전`;
      return `${Math.floor(days / 30)}개월 전`;
    }
    if (lang === 'cs') {
      if (days < 1) return 'Dnes';
      if (days < 7) return `Před ${days} dny`;
      if (days < 30) return `Před ${Math.floor(days / 7)} týdny`;
      return `Před ${Math.floor(days / 30)} měsíci`;
    }
    if (lang === 'pl') {
      if (days < 1) return 'Dzisiaj';
      if (days < 7) return `${days} dni temu`;
      if (days < 30) return `${Math.floor(days / 7)} tyg. temu`;
      return `${Math.floor(days / 30)} mies. temu`;
    }
    if (lang === 'en') {
      if (days < 1) return 'Today';
      if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
      return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
    }
    // es (default)
    if (days < 1) return 'Hoy';
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? 's' : ''}`;
    return `Hace ${Math.floor(days / 30)} mes${Math.floor(days / 30) > 1 ? 'es' : ''}`;
  }
}
