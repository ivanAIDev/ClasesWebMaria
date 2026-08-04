import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TeacherProfileDto, ReviewDto } from '../../models/interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  profile = signal<TeacherProfileDto | null>(null);
  reviews = signal<ReviewDto[]>([]);

  constructor(private api: ApiService) {}

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
    if (days < 1) return 'Hoy';
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? 's' : ''}`;
    return `Hace ${Math.floor(days / 30)} mes${Math.floor(days / 30) > 1 ? 'es' : ''}`;
  }
}
