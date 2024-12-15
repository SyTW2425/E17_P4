import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AlertService } from '../../services/alerts/alert.service';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
  standalone: true, 
  imports: [CommonModule], 
})
export class AlertsComponent implements OnInit {
    alerts: any[] = [];
    token: string | null = null;
    private authService = inject(AuthService); // Inyectamos AuthService
    private alertService = inject(AlertService); // Inyectamos AlertService
  
    ngOnInit() {
      this.loadToken(); // Cargar el token
      if (this.token) {
        this.loadAlerts(); // Cargar alertas si el token está presente
      }
    }
  
    // Método para obtener el token
    loadToken(): void {
      this.token = this.authService.getToken(); // Usa el método del AuthService
      if (!this.token) {
        console.error('No se encontró el token. Por favor, inicia sesión.');
      }
    }
  
    // Método para obtener las alertas
    loadAlerts(): void {
      if (this.token) {
        this.alertService.getAlerts(this.token).subscribe(
          (data) => {
            this.alerts = data;
          },
          (error) => {
            console.error('Error al cargar alertas:', error);
          }
        );
      }
    }
}
