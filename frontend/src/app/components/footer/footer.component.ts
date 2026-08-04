import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section brand">
          <h3>📚 María<span>Clases</span></h3>
          <p>Clases particulares de español e inglés personalizadas. Online y presencial en Praga.</p>
          <div class="social-links">
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="WhatsApp">💬</a>
            <a href="#" aria-label="Email">✉️</a>
          </div>
        </div>

        <div class="footer-section">
          <h4>Clases</h4>
          <a routerLink="/reservar">Español General</a>
          <a routerLink="/reservar">Inglés General</a>
          <a routerLink="/reservar">Preparación DELE</a>
          <a routerLink="/reservar">Preparación Cambridge</a>
        </div>

        <div class="footer-section">
          <h4>Contacto</h4>
          <p>📍 Praga, República Checa</p>
          <p>📞 +420 612 345 678</p>
          <p>✉️ maria&#64;webclases.com</p>
        </div>

        <div class="footer-section">
          <h4>Enlaces</h4>
          <a routerLink="/">Inicio</a>
          <a routerLink="/reservar">Reservar Clase</a>
          <a routerLink="/registro">Registrarse</a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} MaríaClases — Todos los derechos reservados</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg, #2d3436, #636e72);
      color: white;
      padding: 3rem 1.5rem 1rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 2rem;
    }

    .brand {
      h3 {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
        span { color: #e17055; }
      }
      p { color: #b2bec3; line-height: 1.6; }
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      a {
        font-size: 1.3rem;
        text-decoration: none;
        transition: transform 0.2s;
        &:hover { transform: scale(1.2); }
      }
    }

    .footer-section {
      h4 {
        margin-bottom: 1rem;
        color: #ffeaa7;
        font-size: 1.1rem;
      }
      a, p {
        display: block;
        color: #b2bec3;
        text-decoration: none;
        margin-bottom: 0.5rem;
        transition: color 0.2s;
        font-size: 0.95rem;
      }
      a:hover { color: #e17055; }
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 2rem auto 0;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      text-align: center;
      color: #b2bec3;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .social-links { justify-content: center; }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
